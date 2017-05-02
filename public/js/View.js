'use strict';
class View {
  constructor() {
    this.currentProject = '';
    // this.pb2 = new PB2('https://pb2-serverless.jelastic.metropolia.fi', 'cloudmemo');
    this.socket = io.connect('http://127.0.0.1:3001');
    this.socket.on('connect', () => {
      // Connected, let's sign-up for to receive messages for this room
      console.log('socket.io connected!');
      this.socket.emit('room', this.room);
    });
    this.socket.on('message', (data) => {
      console.log('Incoming message:', data);
    });
    this.socket.on('disconnect', () => {
      console.log('socket.io disconnected!');
    });
    this.room = 'test';
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

  initPBReceiver() {
    function onMessage(data) {
      console.log('vastaanotettiin JSON-viesti: ' + data);
    }
    this.pb2.setReceiver(onMessage);
  }

  initEditorListener() {
    const editor = document.getElementById('file-editor');
    editor.addEventListener('change', () => {
      const text = editor.value;
      this.sendToPB(text);
    });
  }

  sendToPB(text) {
    this.pb2.sendJson({
      input: 'jotakin',
      content: text,
    });
  }

  sendMessage() {
    let msg = {};
    this.socket.json.emit('message', msg);
  }

  initSockets() {

  }

}