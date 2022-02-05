/* global PlugIn */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const items = Array.from(selection.tasks).concat(Array.from(selection.projects).map(i => i.task))
    await this.agendasLibrary.selectAndAddToAgenda(items)
  })

  action.validate = function (selection, sender) {
    if (selection.tasks.length === 0) return false
    return !(selection.tasks.some(this.agendasLibrary.isEvent))
  }

  return action
})()
