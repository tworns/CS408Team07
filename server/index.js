var io = require('socket.io');
var server = io.listen(3001);

var rooms = {};

server.on('connection', function (socket) {
  console.log('User connected');

  socket.on('createRoom', function () {
    // Generate room ID, then send it
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var accessCode = '';

    // Worst case time complexity: O(∞)
    do {
      for (var i = 0; i < 4; i++) {
        accessCode += letters.charAt(Math.floor(Math.random() * letters.length));
      }
    } while (rooms[accessCode] !== undefined);

    rooms[accessCode] = {
      players: [],
      currentArtist: 0
    };

    socket.emit('roomCreated', accessCode);

    console.log('Created room with ID ' + accessCode);

    // TODO destroy room once all players leave
  });

  socket.on('joinRoom', function (accessCode, name) {
    if (rooms[accessCode] === undefined) return; // TODO: Send error message?

    rooms[accessCode].players.push(name);

    console.log('Added player ' + name);
  });

  socket.on('leaveRoom', function (accessCode, name) {
    console.log(name + ' disconnected');
  });
});
