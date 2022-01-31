/* global PlugIn */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    // check links
    await this.agendasLibrary.updateAgendas()
  })

  action.validate = function (selection, sender) {
    return true
  }

  return action
})()
