/* global PlugIn Form */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const selected = Array.from(selection.tasks).concat(Array.from(selection.projects).map(i => i.task))

    const events = selected.flatMap(task => this.agendasLibrary.getEvents(task))
    const uniqueEvents = Array.from(new Set(events))

    // create and show form
    const form = new Form()
    form.addField(new Form.Field.MultipleOptions('eventsToRemove', 'Remove agenda items from the following events', uniqueEvents, uniqueEvents.map(e => e.name), uniqueEvents.length === 1 ? uniqueEvents : []))
    await form.show('Remove Event(s)', 'OK')

    form.values.eventsToRemove.forEach(event => selected.forEach(async item => await this.agendasLibrary.removeFromAgenda(event.id.primaryKey, item.id.primaryKey)))
  })

  action.validate = function (selection, sender) {
    const selected = Array.from(selection.tasks).concat(Array.from(selection.projects).map(i => i.task))
    return selected.length > 0 && selected.some(this.agendasLibrary.isItem)
  }

  return action
})()
