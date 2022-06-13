/* global PlugIn */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
      const syncedPrefs = this.agendasLibrary.loadSyncedPrefs()
      syncedPrefs.write('lastUpdatedID', selection.tasks[0].id.primaryKey)
  })

  action.validate = function (selection, sender) {
    return selection.tasks.length === 1 && this.agendasLibrary.isEvent(selection.tasks[0])
  }

  return action
})()
