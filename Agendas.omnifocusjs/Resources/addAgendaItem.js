/* global PlugIn */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {

    // configure tags
    const eventTag = await this.agendasLibrary.getPrefTag('eventTag')

    const items = Array.from(selection.tasks).concat(Array.from(selection.projects).map(i => i.task))

    const chooseEvent = async () => {
      const events = eventTag.remainingTasks
      const form = new Form()
      form.addField(new Form.Field.Option('event', 'Choose Event', events, events.map(e => e.name)))
      await form.show('Choose Event', 'Add Agenda Item')
      return form.values.event
    }

    const event = await chooseEvent()

    // add all selected tasks as agenda items
    items.forEach(async (item) => await this.agendasLibrary.addToAgenda(event, item))

    // show prompt re whether there are more tasks to be linked, if option is set
    const syncedPrefs = this.agendasLibrary.loadSyncedPrefs()
    if (!syncedPrefs.read('promptForAdditional')) return
    const anotherAlert = new Alert('Add more agenda items?', '')
    anotherAlert.addOption('Yes')
    anotherAlert.addOption('No')
    const index = await anotherAlert.show()
    if (index === 0) events.forEach(task => task.addTag(markerTag))
  })

  action.validate = async function (selection, sender) {
    return selection.tasks.length > 0 || selection.projects.length > 0
  }

  return action
})()
