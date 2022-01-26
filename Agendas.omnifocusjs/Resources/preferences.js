/* global PlugIn Form flattenedTags */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const syncedPrefs = this.agendasLibrary.loadSyncedPrefs()

    // get current preferences or set defaults if they don't yet exist
    const markerTag = (syncedPrefs.readString('markerTagID') !== null) ? await this.agendasLibrary.getPrefTag('markerTag') : null
    const eventTag = (syncedPrefs.readString('eventTagID') !== null) ? await this.agendasLibrary.getPrefTag('eventTag') : null
    const itemTag = (syncedPrefs.readString('itemTagID') !== null) ? await this.agendasLibrary.getPrefTag('itemTag') : null
    const addToNote = (syncedPrefs.read('addToNote') !== null) ? syncedPrefs.readBoolean('addToNote') : true
    const promptForAdditional = (syncedPrefs.read('promptForAdditional') !== null) ? syncedPrefs.read('promptForAdditional') : false

    // create and show form
    const form = new Form()
    const tagNames = flattenedTags.map(t => t.name)
    form.addField(new Form.Field.Option('markerTag', 'Marker Tag', flattenedTags, tagNames, markerTag, null))
    form.addField(new Form.Field.Option('eventTag', 'Event Tag', flattenedTags, tagNames, eventTag, null))
    form.addField(new Form.Field.Option('itemTag', 'Agenda Item Tag', flattenedTags, tagNames, itemTag, null))
    form.addField(new Form.Field.Checkbox('addToNote', 'Add link to related tasks to notes', addToNote))
    form.addField(new Form.Field.Checkbox('promptForAdditional', 'Prompt for additional tasks to be added (leaves marker tag applied)', promptForAdditional))
    await form.show('Preferences: Agendas', 'OK')

    // save preferences
    syncedPrefs.write('markerTagID', form.values.markerTag.id.primaryKey)
    syncedPrefs.write('eventTagID', form.values.eventTag.id.primaryKey)
    syncedPrefs.write('itemTagID', form.values.itemTag.id.primaryKey)
    syncedPrefs.write('addToNote', form.values.addToNote)
    syncedPrefs.write('promptForAdditional', form.values.promptForAdditional)

    // update notes if this setting has changed
    if (addToNote && !form.values.addToNote) this.agendasLibrary.removeAllNotes()
    else if (!addToNote && form.values.addToNote) this.agendasLibrary.addAllNotes()
  })

  action.validate = function (selection, sender) {
    // always available on Mac
    if (Device.current.mac) return true

    // otherwise only show when nothing is selected
    return selection.tasks.length === 0 && selection.projects.length === 0
  }

  return action
})()
