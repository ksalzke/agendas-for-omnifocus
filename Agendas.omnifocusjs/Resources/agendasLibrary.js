/* global PlugIn Version Project Alert Tag Task */
(() => {
  const agendasLibrary = new PlugIn.Library(new Version('1.0'))

  agendasLibrary.loadSyncedPrefs = () => {
    const syncedPrefsPlugin = PlugIn.find('com.KaitlinSalzke.SyncedPrefLibrary')

    if (syncedPrefsPlugin !== null) {
      const SyncedPref = syncedPrefsPlugin.library('syncedPrefLibrary').SyncedPref
      return new SyncedPref('com.KaitlinSalzke.Agendas')
    } else {
      const alert = new Alert(
        'Synced Preferences Library Required',
        'For the Agendas plug-in to work correctly, the \'Synced Preferences for OmniFocus\' plugin(https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately. Either you do not currently have this plugin installed, or it is not installed correctly.'
      )
      alert.show()
    }
  }

  agendasLibrary.getLinks = () => {
    const syncedPrefs = agendasLibrary.loadSyncedPrefs()
    return syncedPrefs.read('links') || []
  }

  agendasLibrary.addNotes = (event, item) => {
    // remove note before adding - prevents note being added twice
    agendasLibrary.removeNotes(event, item)

    item.note = `[ Go to event task: omnifocus:///task/${event.id.primaryKey} ] ${event.name}\n\n${item.note}`
    event.note = `[ Go to item task: omnifocus:///task/${item.id.primaryKey} ] ${item.name}\n\n${event.note}`
  }

  agendasLibrary.removeNotes = (event, item) => {
    RegExp.quote = (str) => str.replace(/([*^$[\]\\(){}|-])/g, '\\$1')

    if (item !== null) {
      // remove event from item note
      const regexString = `[ ?Go to event task: omnifocus:///task/${event.id.primaryKey} ?].+`
      const regexForNoteSearch = new RegExp(RegExp.quote(regexString), 'g')
      item.note = item.note.replace(regexForNoteSearch, '')
    }

    if (event !== null) {
      // remove item from event note note
      const regexString = `[ ?Go to item task): omnifocus:///task/${item.id.primaryKey} ?].+`
      const regexForNoteSearch = new RegExp(RegExp.quote(regexString), 'g')
      event.note = event.note.replace(regexForNoteSearch, '')
    }
  }

  agendasLibrary.removeAllNotes = () => {
    const links = agendasLibrary.getLinks()
    links.forEach(link => agendasLibrary.removeNotes(Task.byIdentifier(link[0]), Task.byIdentifier(link[1])))
  }

  agendasLibrary.addAllNotes = () => {
    const links = agendasLibrary.getLinks()
    links.forEach(link => agendasLibrary.addNotes(Task.byIdentifier(link[0]), Task.byIdentifier(link[1])))
  }

  agendasLibrary.addToAgenda = async (event, item) => {
    const syncedPrefs = agendasLibrary.loadSyncedPrefs()
    const links = agendasLibrary.getLinks()
    const eventTag = await agendasLibrary.getPrefTag('eventTag')
    const itemTag = await agendasLibrary.getPrefTag('itemTag')
    const markerTag = await agendasLibrary.getPrefTag('markerTag')

    // add tags
    item.addTag(itemTag)
    event.addTag(eventTag)

    // prepend item details to notes if that setting is selected
    const addToNote = (syncedPrefs.read('addToNote') !== null) ? syncedPrefs.readBoolean('addToNote') : true
    if (addToNote) agendasLibrary.addNotes(event, item)

    // save link in synced prefs
    links.push([event.id.primaryKey, item.id.primaryKey, new Date()])
    syncedPrefs.write('links', links)

    // remove marker tag used for processing
    event.removeTag(markerTag)
  }

  agendasLibrary.removeFromAgenda = async (eventID, itemID) => {
    const itemTag = await agendasLibrary.getPrefTag('itemTag')
    const eventTag = await agendasLibrary.getPrefTag('eventTag')
    const event = Task.byIdentifier(eventID)
    const item = Task.byIdentifier(itemID)

    // remove link from prefs
    const syncedPrefs = agendasLibrary.loadSyncedPrefs()
    const links = agendasLibrary.getLinks()
    const updated = links.filter(link => !(link[0] === eventID && link[1] === itemID))
    syncedPrefs.write('links', updated)

    // remove notes
    agendasLibrary.removeNotes(event, item)

    // update event task if it still exists
    if (event !== null) {
      // if no remaining items, remove tag from event task
      const items = await agendasLibrary.getItems(event)
      if (items.length === 0) {
        event.removeTag(eventTag)
      }
    }

    // update item task if it still exists
    if (item !== null) {
      // if no remaining events, remove tag from item task (and if project set to active)
      const events = await agendasLibrary.getEvents(item)
      if (events.length === 0) item.removeTag(itemTag)
    }
  }

  agendasLibrary.getPrefTag = async (prefTag) => {
    const preferences = agendasLibrary.loadSyncedPrefs()
    const tagID = preferences.readString(`${prefTag}ID`)

    if (tagID !== null && Tag.byIdentifier(tagID) !== null) return Tag.byIdentifier(tagID)

    // if not set, show preferences pane and then try again
    await this.action('preferences').perform()
    return agendasLibrary.getPrefTag(prefTag)
  }

  agendasLibrary.getItems = (task) => {
    const links = agendasLibrary.getLinks()
    return links.filter(link => link[0] === task.id.primaryKey).map(link => Task.byIdentifier(link[1]))
  }

  agendasLibrary.getEvents = (task) => {
    const links = agendasLibrary.getLinks()
    return links.filter(link => link[1] === task.id.primaryKey).map(link => Task.byIdentifier(link[0]))
  }

  agendasLibrary.updateAgendas = async () => {
    // remove duplicates
    const syncedPrefs = agendasLibrary.loadSyncedPrefs()
    const linksWithDuplicates = agendasLibrary.getLinks().map(link => [link[0], link[1]])
    const links = Array.from(new Set(linksWithDuplicates.map(JSON.stringify)), JSON.parse)
    syncedPrefs.write('links', links)

    // get links where one or both of the values has been completed, dropped, or no longer exists
    const linksToRemove = links.filter(link => {
      const [eventID, itemID, dateString=''] = link
      const [event, item, date] = [Task.byIdentifier(eventID), Task.byIdentifier(itemID), new Date(dateString)]

      const lastInstance = (task) => {
          // returns latest instance of a repeating task, or current instance if no previous instances
          const instances = flattenedTasks.filter(t => t.id.primaryKey.includes(task.id.primaryKey))
          const last = instances.sort((a, b) => b.id.primaryKey.split('.')[1] - a.id.primaryKey.split('.')[1])[0]
          return last
      }

      return event === null || item === null || event.taskStatus === Task.Status.Dropped || item.taskStatus === Task.Status.Completed || item.taskStatus === Task.Status.Dropped
    })

    linksToRemove.forEach(link => agendasLibrary.removeFromAgenda(link[0], link[1]))

    // check tasks tagged with 'item' or 'event' and if they are not included in links, remove tag
    const eventTag = await agendasLibrary.getPrefTag('eventTag')
    eventTag.tasks.forEach(async task => {
      const items = await agendasLibrary.getItems(task)
      if (items.length === 0) task.removeTag(eventTag)
    })

    const itemTag = await agendasLibrary.getPrefTag('itemTag')
    itemTag.tasks.forEach(async task => {
      const events = await agendasLibrary.getEvents(task)
      if (events.length === 0) task.removeTag(itemTag)
    })
  }

  agendasLibrary.checkEvent = async (event) => {
    const items = agendasLibrary.getItems(event)
    const form = new Form()
    items.forEach(item => form.addField(new Form.Field.Checkbox(item.id.primaryKey, item.name, false)))
    await form.show(`${event.name}: Select Completed Tasks`, 'Mark Complete')
    items.forEach(item => {
      if (form.values[item.id.primaryKey]) item.markComplete()
    })
  }

  return agendasLibrary
})()
