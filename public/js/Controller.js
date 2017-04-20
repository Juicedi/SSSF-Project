class Controller {
  constructor() {}

  handleProjectTitles(data) {
    view.showProjects(data);
    view.initFileBtn();
    view.initSaveButton();
  }

  getProjectData(id) {
    model.getProjectData(id);
  }

  handleProjectData(data) {
    view.updateFileEditor(data);
  }

  sendProjectUpdate(id, title, content){
    model.updateProject(id, title, content);
  }

  addProject(title, content){
    model.addProject(title, content);
  }

  run() {
    model.setCurrentUser();
    model.getProjectTitles();
    view.initAddProject();
  }

  refresh() {
    model.getProjectTitles();
  }

}