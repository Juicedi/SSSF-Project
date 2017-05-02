'use strict';
/* global io */

class PB2 {

  constructor(serverURL, appName) {
    this.appName = appName;
    this.socket = io(serverURL, {
      extraHeaders: {
        'Access-Control-Allow-Origin': 'Bearer authorization_token_here',
      },
    });
    this.connect(this.appName, this.socket);
  }

  connect(appName, socket) {
    this.socket.on('connect', function () {
      this.sessionid = socket.io.engine.id;
      this.socket.emit('app_id', appName);
      console.log('socket.io connected!');
    }.bind(this));
  }

  setReceiver(receiverFunction) {
    this.socket.on('message', function (msg) {
      console.log('on message');
      if (msg.socketid === this.sessionid) {
        msg.me = true;
      } else {
        msg.me = false;
      }
      receiverFunction(msg);
    }.bind(this));
  }

  sendJson(json) {
    console.log('send json');
    let msg = {};
    msg.app_id = this.appName;
    msg.time = Date.now();
    msg.json = json;
    this.socket.json.emit('message', msg);
  }
}