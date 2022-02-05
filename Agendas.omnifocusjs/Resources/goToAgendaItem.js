/* global PlugIn Form */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const selected = Array.from(selection.tasks).concat(Array.from(selection.projects).map(p => p.task))

    const items = selected.flatMap(task => this.agendasLibrary.getItems(task))
    const uniqueItems = Array.from(new Set(items))

    const chooseItem = async () => {
      const form = new Form()
      form.addField(new Form.Field.Option('itemToGoTo', 'Agenda Item To Go To', uniqueItems, uniqueItems.map(i => i.name), uniqueItems[0]))
      await form.show('Go To Agenda Item', 'OK')
      return form.values.itemToGoTo
    }

    const item = await chooseItem()
    URL.fromString('omnifocus:///task/' + item.id.primaryKey).call(() => {})
  })

  action.validate = function (selection, sender) {
    const selected = Array.from(selection.tasks).concat(Array.from(selection.projects).map(p => p.task))
    return (selected.length === 1) && (this.agendasLibrary.getItems(selected[0]).length > 0)
  }

  return action
})()
