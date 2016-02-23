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
    var room = rooms[accessCode];

    if (room === undefined) {
      console.log('Unknown room code "' + accessCode + '"');
      socket.emit('roomJoined', false, 'Unknown room code "' + accessCode + '"');
      return;
    }

    // Make sure name isn't taken already (Names are used as indices, so duplicates aren't allowed)
    if (room.players[name]) {
      console.log('Username "' + name + '" is already taken in room ' + accessCode);
      socket.emit('roomJoined', false, 'The username "' + name + '" is already taken');
      return;
    }

    // Join the room with given access code. emits will send to just this room now
    socket.join(accessCode);

    room.players[name] = {
      name: name
    };

    console.log('Added player ' + name + ' to room ' + accessCode);

    // Let the player know that the join was successful
    socket.emit('roomJoined', true, 'Success');

    // Inform all other players of the new player list
    server.to(accessCode).emit('updatePlayerList', room.players);
  });

  socket.on('leaveRoom', function (accessCode, name) {
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

    var players = Object.keys(room.players);

    if (players.length === 0) {
      console.log('Room ' + accessCode + ' has become empty, deleting it.');
      delete rooms[accessCode];
    }
    else {
      server.to(accessCode).emit('updatePlayerList', room.players);
    }
  });

  socket.on('startGame', function (accessCode) {
    var room = rooms[accessCode];

    var numPlayers = Object.keys(room.players).length;

    if (room && (numPlayers >= 3 || DEBUG) && !room.gameStarted) {
      room.gameStarted = true;

      // Assign an artist by picking a random player
      var names = Object.keys(room.players);
      var artistName = names.length * Math.random() << 0;
      room.artist = room.players[names[artistName]];

      console.log(artistName + ' is now the artist for room ' + accessCode);

      server.to(accessCode).emit('gameStarted');

      server.to(accessCode).emit('artistSelected', artistName);
    }
  });
});

var oldLog = console.log;
console.log = function (str) {
  if (DEBUG) {
    var now = new Date();
    oldLog(format(now.getHours()) + ':' +
      format(now.getMinutes()) + ':' +
      format(now.getSeconds()) +
      ' ~ ' + str);
  }
};

function format (time) {
  if (time < 10) {
    return '0' + time;
  }
  else {
    return time;
  }
}
