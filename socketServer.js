'use strict';
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
let room1 = 'abc123';

// handle incoming connections from clients
io.sockets.on('connection', (socket) => {
  // once a client has connected, we expect to get a ping from them saying what room they want to join
  console.log(socket.id + ' connected');
  socket.on('room', (room) => {
    socket.leaveAll();
    console.log(room);
    socket.join(room);
    console.log(socket.rooms);
  });
  socket.on('message', (jsonMsg) => {
    console.log('received message from client: ' + JSON.stringify(jsonMsg));
    const response = {
      username: jsonMsg.username,
      msg: jsonMsg.text
    }
    io.in(jsonMsg.room).emit('message', response);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3030, function () {
  console.log('Server started (3000)');
});