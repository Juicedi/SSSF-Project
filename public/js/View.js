'use strict';
class View {

  constructor() {
    this.currentProject = '';
    // this.pb2 = new PB2('https://pb2-serverless.jelastic.metropolia.fi', 'cloudmemo');
    this.socket = io.connect(window.location.host);
    this.room = 'test';
  }

  initFileBtn() {
    const files = document.querySelectorAll('.file');
    for (let i = 0; i < files.length; i++) {
      files[i].addEventListener('click', (e) => {
        const projectId = e.target.dataset.id;
        this._currentProject = projectId;
        for (let i = 0; i < files.length; i++) {
          files[i].classList.remove('active');
        }
        e.target.classList.add('active');
        this.changeRoom(e.target.dataset.id);
        controller.getProjectData(projectId);
      }, this);
      files[i].addEventListener('dblclick', (e) => {
        console.log('doubleclick');
        const oldTitle = e.target.innerHTML;
        console.log(e.target.innerHTML);
        e.target.innerHTML = `<input id="title-editor" type="text" value="${oldTitle}">`;
        document.getElementById('title-editor').focus();
        document.getElementById('title-editor').addEventListener('blur', (e) => {
          const value = e.target.value;
          controller.updateProjectTitle(e.target.parentElement.dataset.id, value);
          e.target.parentElement.innerHTML = value;
        });
        document.getElementById('title-editor').addEventListener('keyup', (e) => {
          if (e.keyCode == 13) {
            e.target.blur();
          }
        });
      }, this);
    }
  }

  showProjects(data) {
    let htmlstring = '';
    const files = document.getElementById('files');

    for (let obj of data) {
      htmlstring += `<div class="file" data-id="${obj._id}">${obj.title}</div>`;
    }

    files.innerHTML = htmlstring;
  }

  initAddProject() {
    document.getElementById('add-project').addEventListener('click', () => {
      controller.addProject();
    });
  }

  initSaveProject() {
    const button = document.getElementById('save-project');
    button.addEventListener('click', () => {
      const activeElem = document.querySelector('.active');
      const textEditor = document.getElementById('file-editor');
      controller.sendProjectUpdate(activeElem.dataset.id, textEditor.value);
    });
  }

  initRemoveProject() {
    const button = document.getElementById('remove-project');
    button.addEventListener('click', (e) => {
      controller.removeProject(e.target.dataset.id);
    });
  }

  initPBReceiver() {
    function onMessage(data) {
      console.log('vastaanotettiin JSON-viesti: ' + data);
    }
    this.pb2.setReceiver(onMessage);
  }

  initEditorListener() {
    const editor = document.getElementById('file-editor');
    editor.addEventListener('input', () => {
      const text = editor.value;
      this.sendMessage(editor.value, editor.selectionStart, editor.selectionEnd);
    });
  }

  updateFileEditor(value) {
    const editor = document.getElementById('file-editor');
    document.getElementById('remove-project').dataset.id = value[0]._id;
    editor.value = value[0].content;
  }

  sendToPB(text) {
    this.pb2.sendJson({
      input: 'jotakin',
      content: text,
    });
  }

  sendMessage(text, cursorStart, cursorEnd) {
    let msg = {};
    msg.app_id = 'app_id';
    msg.time = Date.now();
    msg.json = 'json';
    msg.text = text;
    msg.username = 'nimi';
    msg.room = this.room;
    msg.cursorStart = cursorStart;
    msg.cursorEnd = cursorEnd;
    this.socket.json.emit('message', msg);
  }

  initSockets() {
    this.socket.on('connect', () => {
      // Connected, let's sign-up for to receive messages for this room
      console.log('socket.io connected!');
      this.socket.emit('room', this.room);
    });
    this.socket.on('message', (data) => {
      console.log('Incoming message:', data);
      const editor = document.getElementById('file-editor');
      let start = editor.selectionStart,
        end = editor.selectionEnd;
      if (editor.value.substring(0, start) !== data.msg.substring(0, start)) {
        const difference = data.msg.length - editor.value.length;
        start += difference;
        end += difference;
      }
      editor.value = data.msg;
      editor.setSelectionRange(start, end);
    });
    this.socket.on('disconnect', () => {
      console.log('socket.io disconnected!');
    });
  }

  changeRoom(param) {
    console.log('changing room');
    this.room = param;
    this.socket.emit('room', param);
  }

}
