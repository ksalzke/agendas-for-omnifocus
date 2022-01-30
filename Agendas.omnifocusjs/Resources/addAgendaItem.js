/* global PlugIn */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {

    // configure tags
    const eventTags = await this.agendasLibrary.getEventTags()

    const items = Array.from(selection.tasks).concat(Array.from(selection.projects).map(i => i.task))

    const chooseEvent = async () => {
      const events = eventTags.flatMap(tag => Array.from(tag.remainingTasks))
      const form = new Form()
      form.addField(new Form.Field.Option('event', 'Choose Event', events, events.map(e => e.name)))
      await form.show('Choose Event', 'Add Agenda Item')
      return form.values.event
    }

    const event = await chooseEvent()

    // add all selected tasks as agenda items
    items.forEach(async (item) => await this.agendasLibrary.addToAgenda(event, item))
  })

  action.validate = async function (selection, sender) {
    return selection.tasks.length > 0 || selection.projects.length > 0
  }

  return action
})()
