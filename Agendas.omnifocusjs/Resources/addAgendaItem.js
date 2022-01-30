/* global PlugIn */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {

    const items = Array.from(selection.tasks).concat(Array.from(selection.projects).map(i => i.task))
  
    await this.agendasLibrary.selectAndAddToAgenda(items)
  })

  action.validate = async function (selection, sender) {
    return selection.tasks.length > 0 || selection.projects.length > 0
  }

  return action
})()
