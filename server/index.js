var io = require('socket.io');
var server = io.listen(3001);

// TODO Add more words and move to a separate file
var wordList = ["apple", "bomb", "car", "dog", "electricity", "frog", "ghost", "hockey",
  "island", "justice", "king", "light", "music", "nature", "outside", "photograph", "queen",
  "roller blade", "spring", "thief", "unicycle", "vase", "water", "x-ray", "yo-yo", "zebra"];

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

    socket.name = name;
    socket.accessCode = accessCode;

    console.log('Added player ' + name + ' to room ' + accessCode);

    // Let the player know that the join was successful
    socket.emit('roomJoined', true, 'Success');

    // Inform all other players of the new player list
    server.to(accessCode).emit('updatePlayerList', room.players);
  });

  socket.on('artistDraw', function(x, y, accessCode){
    accessCode = accessCode.toUpperCase();
    //informs outher players of artist's mouse position
    socket.emit('artistDraw', x, y);
  });

  socket.on('leaveRoom', function () {
    console.log(socket.name + ' disconnected from room ' + socket.accessCode);

    var room = rooms[socket.accessCode];

    if (room === undefined) {
      console.log('Unknown room code "' + socket.accessCode + '"');
      return;
    }

    if (room.players[socket.name] === undefined) {
      console.log('Unknown username "' + socket.name + '"');
      return;
    }

    delete room.players[socket.name];

    var players = Object.keys(room.players);

    if (players.length === 0) {
      console.log('Room ' + socket.accessCode + ' has become empty, deleting it.');
      delete rooms[socket.accessCode];
    }
    else {
      server.to(socket.accessCode).emit('updatePlayerList', room.players);
    }
  });

  socket.on('startGame', function (accessCode) {
    var room = rooms[accessCode];

    var numPlayers = Object.keys(room.players).length;

    if (room && (numPlayers >= 3 || DEBUG) && !room.gameStarted) {
      room.gameStarted = true;

      // Assign an artist by picking a random player
      var names = Object.keys(room.players);
      var artistIndex = names.length * Math.random() << 0;
      room.artist = room.players[names[artistIndex]];

      console.log(room.artist.name + ' is now the artist for room ' + accessCode);

      server.to(accessCode).emit('gameStarted');

      server.to(accessCode).emit('artistSelected', room.artist.name);

      createNewWord(accessCode);
    }
  });

  socket.on('newWord', function (accessCode) {
    createNewWord(accessCode);
  });

  socket.on('guess', function (guess, accessCode, name) {
    if (guess.toLowerCase() === rooms[accessCode].word.toLowerCase()) {
      server.to(accessCode).emit('correctGuess', name);
      createNewWord(accessCode);
    }
  });

  function createNewWord (accessCode) {
    var newWord = wordList[Math.floor((Math.random() * wordList.length))];
    rooms[accessCode].word = newWord;
    server.to(accessCode).emit('newWord', newWord);
  }
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
