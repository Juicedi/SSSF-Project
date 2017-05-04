'use strict';
class Controller {
  constructor() { }

  handleProjectTitles(data) {
    view.showProjects(data);
    view.initFileBtn();
  }

  handleSharedProjectTitles(data) {
    view.showSharedProjects(data);
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

  addShare(id, user) {
    model.addShare(id, user);
  }
  removeShare(id, user) {
    model.removeShare(id, user);
  }
  getShared(id) {
    model.getShared(id);
  }
  updateShared(data) {
    view.updateShared(data);
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
    model.getSharedProjectTitles();
    view.initAddProject();
    view.initSaveProject();
    view.initRemoveProject();
    view.initShareProject();
    view.initEditorListener();
    view.initSockets();
  }

  refresh() {
    model.getProjectTitles();
  }

}