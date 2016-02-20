var io = require('socket.io');
var server = io.listen(3001);

var rooms = {};

var DEBUG = true;

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
      players: {},
      gameStarted: false,
      artist: undefined
    };

    socket.emit('roomCreated', accessCode);

    console.log('Created room with ID ' + accessCode);

    // TODO destroy room once all players leave
  });

  socket.on('joinRoom', function (accessCode, name) {
    var room = rooms[accessCode];

    if (room === undefined) return; // TODO: Send error message?

    // Make sure name isn't taken already (Names are used as indices, so duplicates aren't allowed)
    if (room.players[name]) return;  // TODO: Send error message?

    room.players[name] = {};

    console.log('Added player ' + name);

    var numPlayers = Object.keys(room.players).length;

    if (numPlayers === 2 && !room.gameStarted) {
      room.gameStarted = true;

      // Assign an artist by picking a random player
      var keys = Object.keys(room.players);
      room.artist = room.players[keys[keys.length * Math.random() << 0]];
    }
  });

  socket.on('leaveRoom', function (accessCode, name) {
    console.log(name + ' disconnected from room ' + accessCode);

    var room = rooms[accessCode];

    if (room === undefined) return; // TODO: Send error message?
    if (room.players[name] === undefined) return; // TODO: Send error message?

    delete room.players[name];

    var numPlayers = Object.keys(room.players).length;

    if (numPlayers === 0) {
      console.log('Room ' + accessCode + ' has become empty, deleting it.');
      delete rooms[accessCode];
    }
  });
});

var oldLog = console.log;
console.log = function (str) {
  if (DEBUG) {
    oldLog(str);
  }
};
