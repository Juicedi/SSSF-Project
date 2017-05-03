'use strict';
class Controller {
  constructor() { }

  handleProjectTitles(data) {
    view.showProjects(data);
    view.initFileBtn();
  }

  getProjectData(id) {
    model.getProjectData(id);
  }

  handleProjectData(data) {
    view.updateFileEditor(data);
  }

  sendProjectUpdate(id, content) {
    model.updateProject(id, content);
  }

  addProject() {
    model.addProject();
  }

  updateProjectTitle(id, title) {
    model.updateProjectTitle(id, title);
  }

  removeProject(id) {
    model.removeProject(id);
  }

  run() {
    model.setCurrentUser('u');
    model.getProjectTitles();
    view.initAddProject();
    view.initSaveProject();
    view.initRemoveProject();
    // view.initPBReceiver();
    view.initEditorListener();
    view.initSockets();
  }

  refresh() {
    model.getProjectTitles();
  }

}