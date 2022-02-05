/* global PlugIn Form */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const selected = selection.tasks[0]
    const items = this.agendasLibrary.getItems(selected.id.primaryKey)

    const chooseItem = async () => {
      const form = new Form()
      form.addField(new Form.Field.Option('itemToGoTo', 'Agenda Item To Go To', items, items.map(i => i.name), items[0]))
      await form.show('Go To Agenda Item', 'OK')
      return form.values.itemToGoTo
    }

    const item = await chooseItem()
    URL.fromString('omnifocus:///task/' + item.id.primaryKey).call(() => {})
  })

  action.validate = async function (selection, sender) {
    const eventTags = await this.agendasLibrary.getEventTags()
    return (selection.tasks.length === 1 && selection.tasks[0].tags.some(tag => eventTags.includes(tag)))
  }

  return action
})()
