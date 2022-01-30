/* global PlugIn Version Alert Tag Task Form */
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

  agendasLibrary.selectAndAddToAgenda = async (items) => {
    const eventTags = await agendasLibrary.getEventTags()
    const chooseEvent = async () => {
      const syncedPrefs = agendasLibrary.loadSyncedPrefs()
      const lastUpdatedID = syncedPrefs.readString('lastUpdatedID')
      const lastUpdated = (lastUpdatedID !== null && Task.byIdentifier(lastUpdatedID) !== null) ? Task.byIdentifier(lastUpdatedID) : null

      const events = eventTags.flatMap(tag => Array.from(tag.remainingTasks))
      const form = new Form()
      form.addField(new Form.Field.Option('event', 'Choose Event', events, events.map(e => e.name), lastUpdated))
      await form.show('Choose Event', `Add Agenda Item${(items.length > 1) ? 's' : ''}`)
      return form.values.event
    }

    const event = await chooseEvent()

    // add all selected tasks as agenda items
    items.forEach(async (item) => await agendasLibrary.addToAgenda(event, item))
  }

  agendasLibrary.addToAgenda = async (event, item) => {
    const syncedPrefs = agendasLibrary.loadSyncedPrefs()
    const links = agendasLibrary.getLinks()
    const itemTag = await agendasLibrary.getPrefTag('itemTag')

    // add tags
    item.addTag(itemTag)

    // prepend item details to notes if that setting is selected
    const addToNote = (syncedPrefs.read('addToNote') !== null) ? syncedPrefs.readBoolean('addToNote') : true
    if (addToNote) agendasLibrary.addNotes(event, item)

    // save link in synced prefs
    links.push([event.id.primaryKey, item.id.primaryKey, new Date()])
    syncedPrefs.write('links', links)

    // note last updated event in prefs
    syncedPrefs.write('lastUpdatedID', event.id.primaryKey)
  }

  agendasLibrary.removeFromAgenda = async (eventID, itemID) => {
    const itemTag = await agendasLibrary.getPrefTag('itemTag')
    const event = Task.byIdentifier(eventID)
    const item = Task.byIdentifier(itemID)

    // remove link from prefs
    const syncedPrefs = agendasLibrary.loadSyncedPrefs()
    const links = agendasLibrary.getLinks()
    const updated = links.filter(link => !(link[0] === eventID && link[1] === itemID))
    syncedPrefs.write('links', updated)

    // remove notes
    agendasLibrary.removeNotes(event, item)

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

  agendasLibrary.getEventTags = async () => {
    const preferences = agendasLibrary.loadSyncedPrefs()
    const eventTagIDs = preferences.read('eventTagIDs') || []

    const eventTags = eventTagIDs.map(id => Tag.byIdentifier(id)).filter(tag => tag !== null)

    if (eventTags.length === 0) {
      // if not set, show preferences pane and then try again
      await this.action('preferences').perform()
      return agendasLibrary.getEventTags()
    }

    return eventTags
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
      const [eventID, itemID, dateString = ''] = link
      const [event, item, date] = [Task.byIdentifier(eventID), Task.byIdentifier(itemID), new Date(dateString)]

      return event === null || item === null || event.taskStatus === Task.Status.Dropped || item.taskStatus === Task.Status.Completed || item.taskStatus === Task.Status.Dropped
    })

    linksToRemove.forEach(link => agendasLibrary.removeFromAgenda(link[0], link[1]))

    // check tasks tagged with 'item' and if they are not included in links, remove tag
    const itemTag = await agendasLibrary.getPrefTag('itemTag')
    itemTag.tasks.forEach(async task => {
      const events = await agendasLibrary.getEvents(task)
      if (events.length === 0) task.removeTag(itemTag)
    })
  }

  agendasLibrary.processEvent = async (event) => {
    const items = agendasLibrary.getItems(event)
    const form = new Form()
    items.forEach(item => form.addField(new Form.Field.Checkbox(item.id.primaryKey, item.name, false)))
    const actions = ['complete', 'unlink', 're-link', 'drop']
    if (event.repetitionRule !== null) actions.push('defer')
    form.addField(new Form.Field.Option('action', 'Action', actions, actions, 'complete'))
    await form.show(`${event.name}: Process Tasks`, 'Process Tasks')
    const selected = items.filter(item => form.values[item.id.primaryKey])

    switch(form.values.action) {
      case 'complete':
        selected.forEach(item => item.markComplete())
        break
      case 'unlink':
        break
      case 're-link':
        agendasLibrary.selectAndAddToAgenda(selected)
        break
      case 'drop':
        selected.forEach(item => item.drop(false))
        break
      case 'defer':
        // !TODO: implement 'defer' 
    }

    // remove existing links
    selected.forEach(item => agendasLibrary.removeFromAgenda(event.id.primaryKey, item.id.primaryKey))

    // run until there are remaining items
    if (selected.length !== items.length) await agendasLibrary.processEvent(event)
  }

  return agendasLibrary
})()
