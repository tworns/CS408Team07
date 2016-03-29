var io = require('socket.io');
var server = io.listen(3001);
var fs = require('fs');

var gameDifficulty = "hard"; // Need to determine based on current game settings

var wordLists = JSON.parse(fs.readFileSync('server/wordLists.json'));
var usedWords = []; // Array for tracking used words; needs to be cleared each round/game

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
      artist: undefined,
      word: ''
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
      name: name,
      score: 0
    };

    socket.name = name;
    socket.accessCode = accessCode;

    console.log('Added player ' + name + ' to room ' + accessCode);

    // Let the player know that the join was successful
    socket.emit('roomJoined', true, 'Success');

    // Inform all other players of the new player list
    server.to(accessCode).emit('updatePlayerList', room.players);
  });

  socket.on('artistDrawDown', function(x,y,accessCode){
    accessCode = accessCode.toUpperCase();
    server.to(accessCode).emit('artistDrawDown',x,y);
  });

  socket.on('artistDrawMove', function(x,y, accessCode){
    //informs outher players of artist's mouse position
    server.to(accessCode).emit('artistDraw',x,y);
    //console.log('artistMoving! x:' +x+ ' y: ' +y +' \n');//'x = ' + x + 'y = '+y);
  });

  socket.on('artistDrawStop', function(accessCode){

    server.to(socket.accessCode).emit('artistDrawStop');
  });

  //clear all player's screens when the artist clears his.
  socket.on('artistClear',function(accessCode){
    console.log("trying to clear (Server)");
    server.to(socket.accessCode).emit('artistClear');
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

    if (room.artist && room.artist.name === room.players[socket.name]) {
      console.log('Artist has left the game, picking a new one');

      // TODO make sure new artist isn't the one that is leaving
      assignArtist();
    }

    delete room.players[socket.name];

    var players = Object.keys(room.players);

    if (players.length === 0) {
      console.log('Room ' + socket.accessCode + ' has become empty, deleting it.');
      clearInterval(room.interval);
      delete rooms[socket.accessCode];
    }
    else {
      server.to(socket.accessCode).emit('updatePlayerList', room.players);
    }
  });

  socket.on('startGame', function () {
    var room = rooms[socket.accessCode];

    var numPlayers = Object.keys(room.players).length;

    if (room && (numPlayers >= 3 || DEBUG) && !room.gameStarted) {
      createNewWord();

      var roundTime = 120;

      var assignArtist = function() {
        room.gameStarted = true;

        // Assign an artist by picking a random player
        var names = Object.keys(room.players);
        var artistIndex = names.length * Math.random() << 0;
        room.artist = room.players[names[artistIndex]];

        console.log(room.artist.name + ' is now the artist for room ' + socket.accessCode);

        server.to(socket.accessCode).emit('gameStarted', roundTime);

        server.to(socket.accessCode).emit('artistSelected', room.artist.name);
      };
      assignArtist();

      // After 60 seconds, select a new artist
      room.interval = setInterval(function() {
        console.log('Assigning a new artist');
        assignArtist();
      }, roundTime * 1000);
    }
  });

  socket.on('newWord', function () {
    createNewWord(socket.accessCode);
  });

  socket.on('clearUsedWordsList', function() {
    usedWords = [];
  });

  socket.on('guess', function (guess) {
    console.log("Guessing: " +guess);
    console.log("Expecting: "+rooms[socket.accessCode].word);
    if (guess.toLowerCase() === rooms[socket.accessCode].word.toLowerCase()) {
      console.log("CORRECT GUESS");
      server.to(socket.accessCode).emit('correctGuess', socket.name, guess.toLowerCase());
      createNewWord(socket.accessCode);

      rooms[socket.accessCode].players[socket.name].score++;
      server.to(socket.accessCode).emit('updatePlayerList', rooms[socket.accessCode].players);
    }
    else {
      console.log("WRONG GUESS");
      server.to(socket.accessCode).emit('wrongGuess', socket.name);
    }
  });

  function createNewWord () {
    var newWord = getNewWordFromList();
    rooms[socket.accessCode].word = newWord;
    server.to(socket.accessCode).emit('newWord', newWord);
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

function getNewWordFromList() {
  var newWord;

  if (gameDifficulty === "easy") {
    do { // Ensure that new word is not a repeat
      if (usedWords.length === wordLists.easyWordList.length) { // Check if usedWords list needs to be cleared
        usedWords = [];
      }
      newWord = wordLists.easyWordList[Math.floor((Math.random() * wordLists.easyWordList.length))];
    } while (usedWords.indexOf(newWord) !== -1);
    usedWords.push(newWord);
  } else if (gameDifficulty === "medium") {
    do {
      if (usedWords.length === wordLists.mediumWordList.length) { // Check if usedWords list needs to be cleared
        usedWords = [];
      }
      newWord = wordLists.mediumWordList[Math.floor((Math.random() * wordLists.mediumWordList.length))];
    } while (usedWords.indexOf(newWord) !== -1);
    usedWords.push(newWord);
  } else if (gameDifficulty === "hard") {
    do {
      if (usedWords.length === wordLists.hardWordList.length) { // Check if usedWords list needs to be cleared
        usedWords = [];
      }
      newWord = wordLists.hardWordList[Math.floor((Math.random() * wordLists.hardWordList.length))];
    } while (usedWords.indexOf(newWord) !== -1);
    usedWords.push(newWord);
  }

  return newWord;
}
