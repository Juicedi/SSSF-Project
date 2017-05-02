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

  initSockets() {
    const userForm = document.getElementById('user-form');
    const username = document.getElementById('username');
    const clientmsg = document.getElementById('client-message');
    const roomForm = document.getElementById('room-form');
    const roomInput = document.getElementById('room-input');
    const socket = io.connect('http://localhost:3000');
    let room = 'test';

    const removeMessages = () => {
      const messages = document.getElementsByClassName('received-message');
      const elems = messages.length;
      for (let i = elems - 1; i >= 0; i--) {
        messages[i].parentNode.removeChild(messages[i]);
      }
    }
    const changeRoom = (param) => {
      console.log('changing room');
      removeMessages();
      room = param;
      socket.emit('room', param);
    }
    const sendMessage = () => {
      let msg = {};
      msg.app_id = this.appName;
      msg.time = Date.now();
      msg.json = 'json';
      msg.text = clientmsg.value;
      msg.username = username.value;
      msg.room = room;
      socket.json.emit('message', msg);
    }

    socket.on('connect', function () {
      // Connected, let's sign-up for to receive messages for this room
      console.log('socket.io connected!');
      socket.emit('room', room);
    });
    socket.on('message', function (data) {
      console.log('Incoming message:', data);
      document.getElementById('chat-table').innerHTML += `<tr class="received-message"><td>${data.username}</td><td>${data.msg}</td></tr>`;
    });
    socket.on('disconnect', function () {
      console.log('socket.io disconnected!');
    });

    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage();
      console.log('sent text');
    });
    roomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      changeRoom(roomInput.value);
    });
  }

}