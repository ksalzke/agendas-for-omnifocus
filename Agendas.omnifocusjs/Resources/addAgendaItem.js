/* global PlugIn */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {

    // configure tags
    const markerTag = await this.agendasLibrary.getPrefTag('markerTag')

    const items = Array.from(selection.tasks).concat(Array.from(selection.projects).map(i => i.task))

    // get all tasks tagged with 'prerequisite'
    const events = Array.from(markerTag.tasks)

    // add all selected tasks as dependents
    events.forEach((event) => items.forEach(async (item) => await this.agendasLibrary.addToAgenda(event, item)))

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
    // if marker tag not set return false
    const syncedPrefs = this.agendasLibrary.loadSyncedPrefs()
    if (syncedPrefs.readString('markerTagID') == null) return false

    const markerTag = await this.agendasLibrary.getPrefTag('markerTag')

    return (
      (selection.tasks.length > 0 || selection.projects.length > 0) &&
      markerTag.tasks.length >= 1
    )
  }

  return action
})()
