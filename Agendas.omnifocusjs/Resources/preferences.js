/* global PlugIn Form flattenedTags */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const syncedPrefs = this.agendasLibrary.loadSyncedPrefs()

    // get current preferences or set defaults if they don't yet exist
    const itemTag = this.agendasLibrary.prefTag('itemTag')
    const linkedEventTag = this.agendasLibrary.prefTag('linkedEventTag')
    const addToNote = (syncedPrefs.read('addToNote') !== null) ? syncedPrefs.readBoolean('addToNote') : true
    const eventTags = this.agendasLibrary.eventTags()
    const tagLabelsToShow = this.agendasLibrary.tagLabelsToShow()

    // create and show form
    const form = new Form()
    const tagNames = flattenedTags.map(t => t.name)
    form.addField(new Form.Field.Option('itemTag', 'Agenda Item Tag', flattenedTags, tagNames, itemTag, null))
    form.addField(new Form.Field.Option('linkedEventTag', 'Linked Event Tag', flattenedTags, tagNames, linkedEventTag))
    form.addField(new Form.Field.Checkbox('addToNote', 'Add link to related tasks to notes', addToNote))
    form.addField(new Form.Field.MultipleOptions('eventTags', 'Event Tag(s)', flattenedTags, tagNames, eventTags))
    form.addField(new Form.Field.MultipleOptions('tagLabelsToShow', 'Tag(s) To Show When Processing Items', flattenedTags, tagNames, tagLabelsToShow))
    await form.show('Preferences: Agendas', 'OK')

    // save preferences
    syncedPrefs.write('itemTagID', form.values.itemTag.id.primaryKey)
    syncedPrefs.write('linkedEventTagID', form.values.linkedEventTag.id.primaryKey)
    syncedPrefs.write('addToNote', form.values.addToNote)
    syncedPrefs.write('eventTagIDs', form.values.eventTags.map(tag => tag.id.primaryKey))
    syncedPrefs.write('tagLabelsToShowIDs', form.values.tagLabelsToShow.map(tag => tag.id.primaryKey))

    // update notes if this setting has changed
    if (addToNote && !form.values.addToNote) this.agendasLibrary.removeAllNotes()
    else if (!addToNote && form.values.addToNote) this.agendasLibrary.addAllNotes()
  })

  action.validate = function (selection, sender) {
    return true
  }

  return action
})()
