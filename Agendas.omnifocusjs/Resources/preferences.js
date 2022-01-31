/* global PlugIn Form flattenedTags */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const syncedPrefs = this.agendasLibrary.loadSyncedPrefs()

    // get current preferences or set defaults if they don't yet exist
    const itemTag = (syncedPrefs.readString('itemTagID') !== null) ? await this.agendasLibrary.getPrefTag('itemTag') : null
    const addToNote = (syncedPrefs.read('addToNote') !== null) ? syncedPrefs.readBoolean('addToNote') : true
    const eventTags = (syncedPrefs.read('eventTagIDs') !== null) ? await this.agendasLibrary.getEventTags() : []

    // create and show form
    const form = new Form()
    const tagNames = flattenedTags.map(t => t.name)
    form.addField(new Form.Field.Option('itemTag', 'Agenda Item Tag', flattenedTags, tagNames, itemTag, null))
    form.addField(new Form.Field.Checkbox('addToNote', 'Add link to related tasks to notes', addToNote))
    form.addField(new Form.Field.MultipleOptions('eventTags', 'Event Tag(s)', flattenedTags, tagNames, eventTags))
    await form.show('Preferences: Agendas', 'OK')

    // save preferences
    syncedPrefs.write('itemTagID', form.values.itemTag.id.primaryKey)
    syncedPrefs.write('addToNote', form.values.addToNote)
    syncedPrefs.write('eventTagIDs', form.values.eventTags.map(tag => tag.id.primaryKey))

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
