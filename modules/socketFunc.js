module.exports = {
  initSockets: (socket, io) => {
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
        msg: 'testi teksti'
      };
      io.in(jsonMsg.room).emit('message', response);
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  }
};