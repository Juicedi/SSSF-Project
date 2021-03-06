'use strict';
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
      htmlstring += `<div class="file" data-id="${data.indexOf(title)}">${title}</div>`;
    }

    files.innerHTML = htmlstring;
  }

  initAddProject() {
    document.getElementById('add-project').addEventListener('click', () => {
      controller.addProject();
    });
  }

  sendUpdate() {
    const title = document.getElementById('file-title').value;
    const content = document.getElementById('file-editor').value;
    controller.sendProjectUpdate(this._currentProject, title, content);
  }

  initFirepad() {
    // Initialize Firebase
    const config = {
      apiKey: 'AIzaSyB8efsX9zicXI67EsOV1zk2c8uILLzK_zg',
      authDomain: 'cloud-memo-5acd0.firebaseapp.com',
      databaseURL: 'https://cloud-memo-5acd0.firebaseio.com',
      projectId: 'cloud-memo-5acd0',
      storageBucket: 'cloud-memo-5acd0.appspot.com',
      messagingSenderId: '422849767526'
    };
    firebase.initializeApp(config);

    // Get Firebase Database reference.
    var firepadRef = firebase.database().ref();

    // Create CodeMirror (with lineWrapping on).
    var codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });

    // Create Firepad (with rich text toolbar and shortcuts enabled).
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
      richTextShortcuts: true,
      richTextToolbar: true,
      defaultText: 'Hello, World!'
    });
  }

}