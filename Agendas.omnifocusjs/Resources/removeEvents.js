/* global PlugIn Form */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const selected = Array.from(selection.tasks).concat(Array.from(selection.projects).map(p => p.task))

    const events = selected.flatMap(task => this.agendasLibrary.getEvents(task))
    const uniqueEvents = Array.from(new Set(events))

    // create and show form
    const form = new Form()
    form.addField(new Form.Field.MultipleOptions('eventsToRemove', 'Events To Remove', uniqueEvents, uniqueEvents.map(e => e.name), uniqueEvents.length === 1 ? uniqueEvents : []))
    await form.show('Remove Event(s)', 'OK')

    form.values.eventsToRemove.forEach(event => selected.forEach(async selected => await this.agendasLibrary.removeFromAgenda(event.id.primaryKey, selected.id.primaryKey)))
  })

  action.validate = function (selection, sender) {
    if (selection.tasks.length === 0 && selection.projects.length === 0) return false

    const selected = Array.from(selection.tasks).concat(Array.from(selection.projects).map(p => p.task))
    return selected.some(task => this.agendasLibrary.getEvents(task).length > 0)
  }

  return action
})()
