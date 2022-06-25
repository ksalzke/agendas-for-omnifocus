/* global PlugIn Version Alert Tag Task Form flattenedTasks Device */
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
        'For the Agendas plug-in to work correctly, the \'Synced Preferences for OmniFocus\' plug-in (https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately. Either you do not currently have this plugin installed, or it is not installed correctly.'
      )
      alert.show()
    }
  }

  agendasLibrary.getLinks = () => {
    const syncedPrefs = agendasLibrary.loadSyncedPrefs()
    return syncedPrefs.read('links') || []
  }

  agendasLibrary.goTo = async (task) => {
    // new tab - only Mac supported
    if (Device.current.mac) await document.newTabOnWindow(document.windows[0])
    if (task.containingProject !== null) {
      URL.fromString('omnifocus:///task/' + task.containingProject.id.primaryKey).call(() => {})
      URL.fromString('omnifocus:///task/' + task.id.primaryKey).call(() => {})
    }
    // possible bug in OmniFocus where /task/<id> is not working as expected - open inbox instead
    else URL.fromString('omnifocus:///inbox/').open()
    return
  }

  agendasLibrary.addNotes = (event, item) => {
    // remove note before adding - prevents note being added twice
    agendasLibrary.removeNotes(event.id.primaryKey, item.id.primaryKey)

    item.note = `[ Go to event task: omnifocus:///task/${event.id.primaryKey} ] ${event.name}\n\n${item.note}`
    event.note = `[ Go to agenda item: omnifocus:///task/${item.id.primaryKey} ] ${item.name}\n\n${event.note}`
  }

  agendasLibrary.removeNotes = (eventID, itemID) => {
    const event = Task.byIdentifier(eventID)
    const item = Task.byIdentifier(itemID)

    RegExp.quote = (str) => str.replace(/([*^$[\]\\(){}|-])/g, '\\$1')

    if (item !== null) {
      // remove event from item note
      const regexString = `[ ?Go to event task: omnifocus:///task/${eventID} ?].+`
      const regexForNoteSearch = new RegExp(RegExp.quote(regexString), 'g')
      item.note = item.note.replace(regexForNoteSearch, '')
    }

    if (event !== null) {
      // remove item from event note note
      const regexString = `[ ?Go to agenda item: omnifocus:///task/${itemID} ?].+`
      const regexForNoteSearch = new RegExp(RegExp.quote(regexString), 'g')
      event.note = event.note.replace(regexForNoteSearch, '')
    }
  }

  agendasLibrary.removeAllNotes = () => {
    const links = agendasLibrary.getLinks()
    links.forEach(link => agendasLibrary.removeNotes(link[0], link[1]))
  }

  agendasLibrary.addAllNotes = () => {
    const links = agendasLibrary.getLinks()
    links.forEach(link => agendasLibrary.addNotes(Task.byIdentifier(link[0]), Task.byIdentifier(link[1])))
  }

  agendasLibrary.isEvent = (task) => {
    const eventTags = agendasLibrary.eventTags()
    return task.tags.some(tag => eventTags.includes(tag))
  }

  agendasLibrary.isItem = (task) => {
    const preferences = agendasLibrary.loadSyncedPrefs()
    const itemTagID = preferences.readString('itemTagID')
    if (itemTagID === null) return false
    return task.tags.includes(Tag.byIdentifier(itemTagID))
  }

  agendasLibrary.selectAndAddToAgenda = async (items) => {
    const searchForm = async () => {
      const events = await agendasLibrary.getAllEvents()

      if (events.length === 0) {
        const alert = new Alert('No events found', 'There are no events available.')
        alert.show()
        return
      }

      const syncedPrefs = agendasLibrary.loadSyncedPrefs()
      const lastUpdatedID = syncedPrefs.readString('lastUpdatedID')
      const lastUpdated = (lastUpdatedID !== null && Task.byIdentifier(lastUpdatedID) !== null) ? Task.byIdentifier(lastUpdatedID) : null

      const form = new Form()

      // search box
      form.addField(new Form.Field.String('textInput', 'Filter', null))

      // result box
      const searchResults = events
      const searchResultTitles = events.map(event => {
        const tagNames = event.tags.filter(tag => agendasLibrary.eventTags().includes(tag)).map(tag => tag.name)
        const tagList = (agendasLibrary.eventTags().length > 1) ? `[ ${tagNames.join(' | ')}] ` : ''
        const linked = (items.some(item => agendasLibrary.getEvents(item).includes(event))) ? ' [LINKED]' : ''
        return tagList + event.name + linked
      })
      const searchResultIndexes = events.map((e, i) => i)
      const lastUpdatedIndex = (searchResults.indexOf(lastUpdated) === -1) ? null : searchResults.indexOf(lastUpdated)
      const popupMenu = new Form.Field.Option('menuItem', 'Event', searchResultIndexes, searchResultTitles, lastUpdatedIndex)
      popupMenu.allowsNull = true
      popupMenu.nullOptionTitle = 'No Results'
      form.addField(popupMenu)

      // validation
      form.validate = function (formObject) {
        const textValue = formObject.values.textInput || ''
        if (textValue !== currentValue) {
          currentValue = textValue
          // remove popup menu
          if (form.fields.length === 2) {
            form.removeField(form.fields[1])
          }
        }

        if (form.fields.length === 1) {
          // search using provided string)
          const searchResults = events.filter(event => event.name.toLowerCase().includes(textValue.toLowerCase()))
          const resultIndexes = []
          const resultTitles = searchResults.map((event, index) => {
            resultIndexes.push(index)
            const tagNames = event.tags.filter(tag => agendasLibrary.eventTags().includes(tag)).map(tag => tag.name)
            const tagList = (agendasLibrary.eventTags().length > 1) ? `[ ${tagNames.join(' | ')}] ` : ''
            const linked = (items.some(item => agendasLibrary.getEvents(item).includes(event))) ? ' [LINKED]' : ''
            return tagList + event.name + linked
          })
          // add new popup menu
          const popupMenu = new Form.Field.Option(
            'menuItem',
            'Event',
            resultIndexes,
            resultTitles,
            resultIndexes[0]
          )
          form.addField(popupMenu)
          return false
        }
        if (form.fields.length === 2) {
          const menuValue = formObject.values.menuItem
          if (menuValue === undefined || String(menuValue) === 'null') { return false }
          return true
        }
      }

      // show form
      let currentValue = ''
      await form.show('Choose Event', `Add Agenda Item${(items.length > 1) ? 's' : ''}`)

      // PROCESSING USING THE DATA EXTRACTED FROM THE FORM
      const textValue = form.values.textInput || ''
      const menuItemIndex = form.values.menuItem
      const results = events.filter(event => event.name.toLowerCase().includes(textValue.toLowerCase()))
      return results[menuItemIndex]
    }

    const event = await searchForm()

    // add all selected tasks as agenda items
    for (const item of items) {
      await agendasLibrary.addToAgenda(event, item)
    }
  }

  agendasLibrary.addToAgenda = async (event, item) => {
    const syncedPrefs = agendasLibrary.loadSyncedPrefs()
    const links = agendasLibrary.getLinks()
    const itemTag = await agendasLibrary.getPrefTag('itemTag')
    const linkedEventTag = await agendasLibrary.getPrefTag('linkedEventTag')

    // check if is already linked to event - if it is, do not proceed
    if (links.some(link => link[0] === event.id.primaryKey && link[1] === item.id.primaryKey)) return

    // add tags
    item.addTag(itemTag)
    event.addTag(linkedEventTag)

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
    const currentInstanceEventID = eventID.split('.')[0]
    const itemTag = await agendasLibrary.getPrefTag('itemTag')
    const linkedEventTag = await agendasLibrary.getPrefTag('linkedEventTag')
    const item = Task.byIdentifier(itemID)
    const event = Task.byIdentifier(eventID)
    const currentInstanceEvent = Task.byIdentifier(currentInstanceEventID)

    // remove link from prefs
    const syncedPrefs = agendasLibrary.loadSyncedPrefs()
    const links = agendasLibrary.getLinks()
    const updated = links.filter(link => !(link[0] === currentInstanceEventID && link[1] === itemID))
    syncedPrefs.write('links', updated)

    // remove notes
    agendasLibrary.removeNotes(eventID, itemID)
    agendasLibrary.removeNotes(currentInstanceEventID, itemID)

    if (item !== null) {
      // if no remaining events, remove tag from item task
      const events = await agendasLibrary.getEvents(item)
      if (events.length === 0) item.removeTag(itemTag)
    }

    // if no remaining items, remove tag from event task
    if (event !== null) {
      const items = await agendasLibrary.getItems(eventID)
      if (items.length === 0) event.removeTag(linkedEventTag)
    }

    if (currentInstanceEvent !== null) {
      const items = await agendasLibrary.getItems(eventID)
      if (items.length === 0) event.removeTag(linkedEventTag)
    }
  }

  agendasLibrary.prefTag = prefTag => {
    const preferences = agendasLibrary.loadSyncedPrefs()
    const tagID = preferences.readString(`${prefTag}ID`)

    if (tagID !== null && Tag.byIdentifier(tagID) !== null) return Tag.byIdentifier(tagID)
    return null
  }

  agendasLibrary.getPrefTag = async (prefTag) => {
    const tag = agendasLibrary.prefTag(prefTag)

    if (tag !== null) return tag
    // if not set, show preferences pane and then try again)
    await this.action('preferences').perform()
    return agendasLibrary.getPrefTag(prefTag)
  }

  agendasLibrary.eventTags = () => {
    const preferences = agendasLibrary.loadSyncedPrefs()
    const eventTagIDs = preferences.read('eventTagIDs') || []

    return eventTagIDs.map(id => Tag.byIdentifier(id)).filter(tag => tag !== null)
  }

  agendasLibrary.getEventTags = async () => {
    const eventTags = agendasLibrary.eventTags()

    if (eventTags.length === 0) {
      // if not set, show preferences pane and then try again
      await this.action('preferences').perform()
      return agendasLibrary.getEventTags()
    }
    return eventTags
  }

  agendasLibrary.getItems = (taskID) => {
    const links = agendasLibrary.getLinks()
    return links.filter(link => link[0] === taskID.split('.')[0]).map(link => link[1]).map(id => Task.byIdentifier(id))
  }

  agendasLibrary.getAllEvents = async () => {
    const eventTags = await agendasLibrary.getEventTags()
    return eventTags.flatMap(tag => Array.from(tag.remainingTasks))
  }

  agendasLibrary.getEvents = (task) => {
    const links = agendasLibrary.getLinks()
    return links.filter(link => link[1] === task.id.primaryKey).map(link => Task.byIdentifier(link[0]))
  }

  agendasLibrary.lastInstance = task => {
    // returns latest instance of a repeating task, or current instance if no previous instances
    const instances = flattenedTasks.filter(t => t.id.primaryKey.includes(task.id.primaryKey))
    const last = instances.sort((a, b) => b.id.primaryKey.split('.')[1] - a.id.primaryKey.split('.')[1])[0]
    return last
  }

  agendasLibrary.cleanUp = async () => {
    // remove duplicates
    const syncedPrefs = agendasLibrary.loadSyncedPrefs()
    const linksWithDuplicates = agendasLibrary.getLinks().map(link => [link[0], link[1], link[2]])
    const links = Array.from(new Set(linksWithDuplicates.map(JSON.stringify)), JSON.parse)
    syncedPrefs.write('links', links)

    // remove links where agenda item has been completed, dropped, or no longer exists
    const linksToRemove = links.filter(link => {
      const [eventID, itemID, dateString = ''] = link
      const [, item, date] = [Task.byIdentifier(eventID), Task.byIdentifier(itemID), new Date(dateString)]
      return item === null || item.taskStatus === Task.Status.Completed || item.taskStatus === Task.Status.Dropped || (item.repetitionRule !== null && agendasLibrary.lastInstance(item).completionDate > date)
    })
    linksToRemove.forEach(link => agendasLibrary.removeFromAgenda(link[0], link[1]))

    // check tasks tagged with 'item' and if they are not included in links, remove tag
    const itemTag = await agendasLibrary.getPrefTag('itemTag')
    for (const task of itemTag.tasks) {
      const events = await agendasLibrary.getEvents(task)
      if (events.length === 0) task.removeTag(itemTag)
    }

    // check tasks tagged with 'linked event' and if they are not included in links, remove tag
    const linkedEventTag = await agendasLibrary.getPrefTag('linkedEventTag')
    for (const task of linkedEventTag.tasks) {
      const items = await agendasLibrary.getItems(task.id.primaryKey)
      if (items.length === 0) task.removeTag(linkedEventTag)
    }
  }

  agendasLibrary.updateAgendas = async () => {
    const links = agendasLibrary.getLinks()
    agendasLibrary.cleanUp()

    // process events that have been completed, dropped, or no longer exist

    const relevantEventIDs = links.map(link => {
      const [eventID, itemID, dateString = ''] = link
      const [event, , date] = [Task.byIdentifier(eventID), Task.byIdentifier(itemID), new Date(dateString)]
      if (event === null || event.taskStatus === Task.Status.Completed || event.taskStatus === Task.Status.Dropped) return eventID
      if (event.repetitionRule !== null) {
        const lastInstance = agendasLibrary.lastInstance(event)
        if (lastInstance.completionDate > date) return lastInstance.id.primaryKey
      }
      return null // no criteria matched, event task still exists
    }).filter(id => id !== null)

    const uniqueEventIDs = Array.from(new Set(relevantEventIDs))

    for (const eventID of uniqueEventIDs) {
      await agendasLibrary.processEvent(eventID)
      await agendasLibrary.cleanUp()
    }
  }

  agendasLibrary.processEvent = async (eventID) => {
    // only continue if not already running
    const syncedPrefs = agendasLibrary.loadSyncedPrefs()
    if (syncedPrefs.readBoolean('processEventRunning')) return
    syncedPrefs.write('processEventRunning', true)

    const event = Task.byIdentifier(eventID)
    const items = agendasLibrary.getItems(eventID).sort((a, b) => (a.taskStatus < b.taskStatus) ? -1 : 1)

    const currentInstanceID = eventID.split('.')[0]
    if (items.length === 0) {
      syncedPrefs.write('processEventRunning', false)
      return
    }
    const form = new Form()
    form.validate = (form) => {
      const selected = items.filter(item => form.values[item.id.primaryKey])
      if (form.values.action === 'rename' || form.values.action === 'go to') return selected.length === 1
      else return selected.length > 0
    }

    items.forEach(item => {
      const statusLabel = (item.taskStatus === Task.Status.Blocked) ? ' [INACTIVE]' : ''
      form.addField(new Form.Field.Checkbox(item.id.primaryKey, item.name + statusLabel, false))
    })
    const actions = ['complete', 'unlink', 're-link', 'drop', 'rename', 'go to', 'edit note']
    const actionNames = ['Complete agenda item(s)', 'Unlink agenda item(s)', 'Link agenda item(s) to a different event', 'Drop agenda item(s)', 'Rename agenda item (one only)', 'Show agenda item in project (one only)', 'Edit note(s)']
    if (event !== null && event.repetitionRule !== null) {
      actions.push('defer')
      actionNames.push('Defer agenda item(s)')
    }
    form.addField(new Form.Field.Option('action', 'Action', actions, actionNames, 'complete'))
    const prompt = (event === null) ? 'Event (name unknown) no longer exists: review agenda items' : `'${event.name}': review agenda items`
    try { await form.show(prompt, 'Process Tasks') } catch (error) {
      console.log(error)
      syncedPrefs.write('processEventRunning', false)
      return
    }
    const selected = items.filter(item => form.values[item.id.primaryKey])

    // remove existing links
    if (!['rename', 'go to', 'edit note'].includes(form.values.action)) {
      for (const item of selected) await agendasLibrary.removeFromAgenda(eventID, item.id.primaryKey)
    }

    const rename = async (task) => {
      const form = new Form()
      form.addField(new Form.Field.String('name', 'New name', task.name))
      await form.show('Rename agenda item', 'Rename')
      task.name = form.values.name
    }

    const editNote = async (task) => {
      const form = new Form()
      form.addField(new Form.Field.String('note', '', task.note, null))
      await form.show(`Edit note for '${task.name}'`, 'OK')
      task.note = form.values.note
    }

    switch (form.values.action) {
      case 'complete':
        selected.forEach(item => item.markComplete())
        break
      case 'unlink':
        break
      case 're-link':
        await agendasLibrary.selectAndAddToAgenda(selected)
        break
      case 'rename':
        await rename(selected[0])
        break
      case 'edit note':
        for (const item of selected) await editNote(item)
        break
      case 'go to':
        // stop processing tasks for now
        syncedPrefs.write('processEventRunning', false)
        await agendasLibrary.goTo(selected[0])
        return
      case 'drop':
        selected.forEach(item => item.drop(false))
        break
      case 'defer':
        for (const item of selected) {
          const newInstance = Task.byIdentifier(currentInstanceID)
          await agendasLibrary.addToAgenda(newInstance, item)
        }
        break
    }

    // run until there are no remaining items
    syncedPrefs.write('processEventRunning', false)
    if (selected.length !== items.length) await agendasLibrary.processEvent(eventID)
  }

  return agendasLibrary
})()
