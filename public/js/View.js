'use strict';
class View {

  constructor() {
    this.currentProject = '';
    this.socket = io.connect(window.location.host);
    this.room = 'test';
  }

  toggleEditorAndButtons(action) {
    const editor = document.getElementById('editor');
    const buttons = document.getElementById('buttons');
    const shareBtn = document.getElementById('share-project');
    const removeBtn = document.getElementById('remove-project');
    if (action === 'hide') {
      editor.classList.add('hide');
      buttons.classList.add('hide');
    } else if (action === 'shared') {
      shareBtn.classList.add('hide');
      removeBtn.classList.add('hide');
    } else {
      editor.classList.remove('hide');
      buttons.classList.remove('hide');
      shareBtn.classList.remove('hide');
      removeBtn.classList.remove('hide');
    }
  }

  /**
   * Hides or reveals share-modal.
   * @param {String} action 
   */
  toggleShareModal(action) {
    const modal = document.getElementById('share');
    if (action === 'hide') {
      modal.classList.add('hide');
    } else {
      modal.classList.remove('hide');
    }
  }

  toggleFileSelect(elem) {
    const files = document.querySelectorAll('.file');
    for (let i = 0; i < files.length; i++) {
      files[i].classList.remove('active');
    }
    if (elem) {
      elem.classList.add('active');
    }
  }

  initFileBtn() {
    const files = document.querySelectorAll('.file');
    for (let i = 0; i < files.length; i++) {
      files[i].addEventListener('click', (e) => {
        const projectId = e.target.dataset.id;
        this._currentProject = projectId;
        this.changeRoom(e.target.dataset.id);
        this.toggleFileSelect(e.target);
        this.toggleEditorAndButtons('reveal');
        if (e.target.classList.contains('shared-file')) {
          this.toggleEditorAndButtons('shared');
        }
        controller.getProjectData(projectId);
        controller.getShared(projectId);
      }, this);
      files[i].addEventListener('dblclick', (e) => {
        if (!e.target.classList.contains('shared-file')) {
          const oldTitle = e.target.innerHTML;
          e.target.innerHTML = `<input id="title-editor" type="text" value="${oldTitle}">`;
          const titleEditor = document.getElementById('title-editor');
          titleEditor.focus();
          titleEditor.addEventListener('blur', (e) => {
            const value = e.target.value;
            controller.updateProjectTitle(e.target.parentElement.dataset.id, value);
            e.target.parentElement.innerHTML = value;
          });
          titleEditor.addEventListener('keyup', (e) => {
            if (e.keyCode == 13) {
              e.target.blur();
            }
          });
        }
      }, this);
    }
  }

  showProjects(data) {
    const files = document.getElementById('files');
    let htmlstring = '';
    for (let obj of data) {
      htmlstring += `<div class="file" data-id="${obj._id}">${obj.title}</div>`;
    }
    files.innerHTML = htmlstring;
  }

  showSharedProjects(data) {
    const files = document.getElementById('files');
    let htmlstring = '';
    for (let obj of data) {
      htmlstring += `<div class="file shared-file" data-id="${obj._id}">${obj.title} [Shared]</div>`;
    }
    files.innerHTML += htmlstring;
  }

  initAddProject() {
    document.getElementById('add-project').addEventListener('click', () => {
      controller.addProject();
    });
  }

  initSaveProject() {
    document.getElementById('save-project').addEventListener('click', () => {
      const activeElem = document.querySelector('.active');
      const textEditor = document.getElementById('file-editor');
      this.toggleEditorAndButtons('hide');
      this.toggleFileSelect();
      controller.sendProjectUpdate(activeElem.dataset.id, textEditor.value);
    });
  }

  /**
   * Initializes share-modal buttons.
   */
  initShareProject() {
    document.getElementById('share-project').addEventListener('click', () => {
      this.toggleShareModal();
    });
    document.getElementById('share-close').addEventListener('click', () => {
      this.toggleShareModal('hide');
    });
    document.getElementById('add-share').addEventListener('click', () => {
      const input = document.getElementById('share-input');
      const id = document.querySelector('.file.active').dataset.id;
      controller.addShare(id, input.value);
      input.value = '';
    });
  }

  initRemoveProject() {
    document.getElementById('remove-project').addEventListener('click', (e) => {
      this.toggleEditorAndButtons('hide');
      this.toggleFileSelect();
      controller.removeProject(e.target.dataset.id);
    });
  }

  initEditorListener() {
    const editor = document.getElementById('file-editor');
    editor.addEventListener('input', () => {
      const text = editor.value;
      this.sendMessage(editor.value, editor.selectionStart, editor.selectionEnd);
    });
  }

  /**
   * Initializes the shared users list items,
   * so they can be removed when clicked on them.
   */
  initSharedUsers() {
    const sharedUsers = document.querySelectorAll('.shared-user');
    for (let i = 0; i < sharedUsers.length; i++) {
      sharedUsers[i].addEventListener('click', (e) => {
        const user = e.target.innerHTML;
        const id = document.querySelector('.file.active').dataset.id;
        const r = confirm('Do you want to remove ' + user + ' from shared users');
        if (r == true) {
          controller.removeShare(id, user);
        }
      });
    }
  }

  /**
   * Puts the project text to the textarea.
   * @param {Text} value 
   */
  updateFileEditor(value) {
    const editor = document.getElementById('file-editor');
    document.getElementById('remove-project').dataset.id = value[0]._id;
    editor.value = value[0].content;
  }

  /**
   * Updates the list in share-modal.
   * List contains all of the users the project is shared with.
   * @param {Array} data 
   */
  updateShared(data) {
    const list = document.getElementById('shared-list');
    list.innerHTML = '';
    for (const user in data) {
      list.innerHTML += `<p class="shared-user">${data[user]}</p>`;
    }
    this.initSharedUsers();
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
    const data = {
      newRoom: param,
    };
    if (document.querySelector('.file.active')) {
      data.oldRoom = document.querySelector('.file.active').dataset.id;
    }
    this.socket.emit('room', data);
  }

}
