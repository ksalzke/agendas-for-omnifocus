/* global PlugIn Form */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const events = selection.tasks.flatMap(task => this.agendasLibrary.getEvents(task))
    const uniqueEvents = Array.from(new Set(events))

    // create and show form
    const form = new Form()
    form.addField(new Form.Field.MultipleOptions('eventsToRemove', 'Remove agenda items from the following events', uniqueEvents, uniqueEvents.map(e => e.name), uniqueEvents.length === 1 ? uniqueEvents : []))
    await form.show('Remove Event(s)', 'OK')

    form.values.eventsToRemove.forEach(event => selection.tasks.forEach(async selected => await this.agendasLibrary.removeFromAgenda(event.id.primaryKey, selected.id.primaryKey)))
  })

  action.validate = function (selection, sender) {
    if (selection.tasks.length === 0) return false

    return selection.tasks.some(this.agendasLibrary.isItem)
  }

  return action
})()
