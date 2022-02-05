/* global PlugIn Alert */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const task = selection.tasks[0]
    const items = this.agendasLibrary.getItems(task.id.primaryKey)
    if (items.length === 0) {
      const alert = new Alert('No linked agenda items', `There are no agenda items linked to '${task.name}'.`)
      alert.show()
    } else {
      await this.agendasLibrary.processEvent(task.id.primaryKey)
    }
  })

  action.validate = async function (selection, sender) {
    const eventTags = await this.agendasLibrary.getEventTags()
    return (selection.tasks.length === 1 && selection.tasks[0].tags.some(tag => eventTags.includes(tag)))
  }

  return action
})()
