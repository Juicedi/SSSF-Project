class View {
  constructor() {
    this.currentProject = '';
  }

  initFileBtn() {
    const files = document.querySelectorAll('.file');
    for (let i = 0; i < files.length; i++) {
      files[i].addEventListener('click', (e) => {
        const projectId = e.target.dataset.id;
        this._currentProject = projectId;
        controller.getProjectData(projectId);
      }, this);
    }
  }

  updateFileEditor(data) {
    document.getElementById('file-title').value = data.title;
    document.getElementById('file-editor').value = data.content;
  }

  showProjects(data) {
    let htmlstring = '';
    const files = document.getElementById('files');

    for (let title of data) {
      htmlstring += `<div class="file" data-id="${data.indexOf(title)}">${title}</div>`
    }

    files.innerHTML = htmlstring;
  }

  initAddForm() {
    document.getElementById('add-project-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('add-title').value
      const content = document.getElementById('add-content').value
      controller.addProject(title, content);
    });
  }

  initSaveButton() {
    document.getElementById('update').addEventListener('click', () => {
      this.sendUpdate();
    });
  }

  sendUpdate() {
    const title = document.getElementById('file-title').value
    const content = document.getElementById('file-editor').value
    controller.sendProjectUpdate(this._currentProject, title, content)
  }

}