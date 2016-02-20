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
  });

  socket.on('joinRoom', function (accessCode, name) {
    accessCode = accessCode.toUpperCase();

    var room = rooms[accessCode];

    if (room === undefined) {
      console.log('Unknown room code "' + accessCode + '"');
      socket.emit('roomJoined', false, 'Unknown room code "' + accessCode + '"');
      return;
    }

    // Make sure name isn't taken already (Names are used as indices, so duplicates aren't allowed)
    if (room.players[name]) {
      console.log('Username "' + name + '" is already taken');
      socket.emit('roomJoined', false, 'The username "' + name + '" is already taken');
      return;
    }

    room.players[name] = {};

    console.log('Added player ' + name);

    var numPlayers = Object.keys(room.players).length;

    if (numPlayers >= 3 && !room.gameStarted) {
      room.gameStarted = true;

      // Assign an artist by picking a random player
      var names = Object.keys(room.players);
      var artistName = names.length * Math.random() << 0;
      room.artist = room.players[names[artistName]];

      console.log(artistName + ' is now the artist.');
    }

    // Let the player know that the join was successful
    socket.emit('roomJoined', true, 'Success');
  });

  socket.on('leaveRoom', function (accessCode, name) {
    accessCode = accessCode.toUpperCase();
    console.log(name + ' disconnected from room ' + accessCode);

    var room = rooms[accessCode];

    if (room === undefined) {
      console.log('Unknown room code "' + accessCode + '"');
      return;
    }

    if (room.players[name] === undefined) {
      console.log('Unknown username "' + name + '"');
      return;
    }

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
