module.exports = {
  initSockets: (socket, io) => {
    // once a client has connected, we expect to get a ping from them saying what room they want to join
    console.log('Socket connected');
    socket.on('room', (room) => {
      socket.leaveAll();
      console.log(room);
      socket.join(room);
      console.log(socket.rooms);
    });
    socket.on('message', (jsonMsg) => {
      console.log('received message from client: ' + JSON.stringify(jsonMsg));
      const response = {
        msg: jsonMsg.text,
      };
      io.in(jsonMsg.room).emit('message', response);
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('connect_failed', (err) => {
      console.log('Socket connection failed' + err);
    });
    socket.on('error', (text) => {
      console.log('Socket Error: ' + text);
    });
  }
};