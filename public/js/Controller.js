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

  addProject(){
    model.addProject();
  }

  run() {
    model.setCurrentUser('u');
    model.getProjectTitles();
    view.initAddProject();
    view.initFirepad();
  }

  refresh() {
    model.getProjectTitles();
  }

}