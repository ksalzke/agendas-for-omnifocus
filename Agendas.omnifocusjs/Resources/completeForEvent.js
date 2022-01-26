/* global PlugIn */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    // if called externally (from script) generate selection object
    if (typeof selection === 'undefined') {
      selection = document.windows[0].selection
    }

    // check links
    await this.agendasLibrary.updateAgendas()

    // mark tasks as complete
    selection.tasks.forEach(task => {
      task.markComplete()
      this.agendasLibrary.checkEvent(task)
    })
    selection.projects.forEach(project => {
      project.markComplete()
      this.agendasLibrary.checkEvent(project.task)
    })
  })

  action.validate = function (selection, sender) {
    return selection.tasks.length > 0 || selection.projects.length > 0
  }

  return action
})()
