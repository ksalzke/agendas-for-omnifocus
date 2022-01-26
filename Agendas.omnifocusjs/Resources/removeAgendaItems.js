/* global PlugIn Form */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const selected = Array.from(selection.tasks).concat(Array.from(selection.projects).map(p => p.task))

    const items = selected.flatMap(task => this.agendasLibrary.getItems(task))
    const uniqueItems = Array.from(new Set(items))

    // create and show form
    const form = new Form()
    form.addField(new Form.Field.MultipleOptions('itemsToRemove', 'Agenda Items To Remove', uniqueItems, uniqueItems.map(i => i.name), uniqueItems.length === 1 ? uniqueItems : []))
    await form.show('Remove Agenda Item(s)', 'OK')

    form.values.itemsToRemove.forEach(item => selected.forEach(async selected => await this.agendasLibrary.removeFromAgenda(selected.id.primaryKey, item.id.primaryKey)))
  })

  action.validate = function (selection, sender) {
    if (selection.tasks.length === 0 && selection.projects.length === 0) return false

    const selected = Array.from(selection.tasks).concat(Array.from(selection.projects).map(p => p.task))
    return selected.some(task => this.agendasLibrary.getItems(task).length > 0)
  }

  return action
})()
