/* global PlugIn Form Alert */
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

    if (items.length === 0) {
      const alert = new Alert('No linked agenda items', `There are no agenda items linked to '${selected.name}'.`)
      alert.show()
    } else {
      const item = await chooseItem()
      URL.fromString('omnifocus:///task/' + item.id.primaryKey).call(() => {})
    }
  })

  action.validate = function (selection, sender) {
    return (selection.tasks.length === 1 && this.agendasLibrary.isEvent(selection.tasks[0]))
  }

  return action
})()
