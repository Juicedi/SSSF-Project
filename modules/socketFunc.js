module.exports = {
  initSockets: (socket, io) => {
    // once a client has connected, we expect to get a ping from them saying what room they want to join
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