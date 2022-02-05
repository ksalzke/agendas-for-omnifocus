/* global PlugIn Alert */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    // if called externally (from script) generate selection object
    if (typeof selection === 'undefined') {
      selection = document.windows[0].selection
    }

    selection.tasks.forEach(async task => {
      task.markComplete()
      const items = this.agendasLibrary.getItems(task.id.primaryKey)
      if (items.length === 0) {
        const alert = new Alert('No linked agenda items', `There are no agenda items linked to '${task.name}'.`)
        alert.show()
      } else {
        await this.agendasLibrary.updateAgendas()
      }
    })
  })

  action.validate = function (selection, sender) {
    return selection.tasks.length > 0
  }

  return action
})()
