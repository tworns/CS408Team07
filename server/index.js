var io = require('socket.io');
var server = io.listen(3001);

var accessCodes = [];

server.on('connection', function (socket) {
  socket.on('createRoom', function(args) {
    console.log('Creating a new room');

    // Generate room ID, then send it
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var accessCode = '';

    // TODO it is possible for collision. Detect by keeping track of existing codes and checking
    for (var i = 0; i < 4; i++) {
      accessCode += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    accessCodes.push(accessCode);

    socket.emit('roomCreated', accessCode);
  });
});
