/* global PlugIn Form */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const selected = Array.from(selection.tasks).concat(Array.from(selection.projects).map(p => p.task))

    const events = selected.flatMap(task => this.agendasLibrary.getEvents(task))
    const uniqueEvents = Array.from(new Set(events))

    const chooseEvent = async () => {
      const form = new Form()
      form.addField(new Form.Field.Option('eventToGoTo', 'Event To Go To', uniqueEvents, uniqueEvents.map(p => p.name), uniqueEvents[0]))
      await form.show('Go To Event', 'OK')
      return form.values.eventToGoTo
    }

    const event = await chooseEvent()
    URL.fromString('omnifocus:///task/' + event.id.primaryKey).call(() => {})
  })

  action.validate = function (selection, sender) {
    const selected = Array.from(selection.tasks).concat(Array.from(selection.projects).map(p => p.task))
    return (selected.length === 1) && (this.agendasLibrary.getEvents(selected[0]).length > 0)
  }

  return action
})()
