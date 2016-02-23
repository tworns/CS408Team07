angular.module('yoodle')

.factory('roomService', function ($interval) {
  var roomID = '';
  var IDCallback;

  var playerList;
  var playerListCallback;

  var timerCallback;

  var currentWord = '';
  var wordCallback;

  return {
    setRoomIDCallback: function(func) {
      IDCcallback = func;
    },

    setRoomID: function (id) {
      roomID = id;

      if (IDCallback) {
        IDCallback(roomID);
      }
    },

    getRoomID: function () {
      return roomID;
    },

    setPlayerListCallback: function (func) {
      playerListCallback = func;
    },

    setPlayerList: function (players) {
      playerList = players;

      if (playerListCallback) {
        playerListCallback(players);
      }
    },

    setTimerCallback: function (func) {
      timerCallback = func;
    },

    getPlayerList: function () {
      return playerList;
    },

    newTimer: function () {
      var timer = $interval(function () {
        if (timerCallback) {
          timerCallback(timer);
        }
      }, 1000);
    },

    setWordCallback: function (func) {
      wordCallback = func;
    },

    setWord: function (word) {
      currentWord = word;

      if (wordCallback) {
        wordCallback(word);
      }
    },

    getWord: function () {
      return currentWord;
    },
  };
});
