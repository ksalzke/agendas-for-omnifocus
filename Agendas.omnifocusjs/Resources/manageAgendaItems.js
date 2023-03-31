/* global PlugIn Alert */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const task = selection.tasks[0] || selection.projects[0].task
    this.agendasLibrary.cleanUp()
    const items = this.agendasLibrary.getItems(task.id.primaryKey)
    if (items.length === 0) {
      const alert = new Alert('No linked agenda items', `There are no agenda items linked to '${task.name}'.`)
      alert.show()
    } else {
      await this.agendasLibrary.processEvent(task.id.primaryKey)
    }
  })

  action.validate = function (selection, sender) {
    return (selection.tasks.length === 1 && this.agendasLibrary.isEvent(selection.tasks[0])) ||
      (selection.projects.length === 1 && this.agendasLibrary.isEvent(selection.projects[0].task))
  }

  return action
})()
