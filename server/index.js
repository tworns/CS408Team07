var io = require('socket.io')(3001);

io.on('connection', function (socket) {
  socket.on('message', function (msg) {
    console.log(msg);
    
  });

  socket.on('disconnect', function (msg) {
    console.log(msg);
  });

});
