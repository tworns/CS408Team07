angular.module('yoodle')

.factory('roomService', function ($interval) {
  var roomID = '';
  var IDCallback;

  var playerList;
  var playerListCallback;

  var timerCallback = function () {};

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

    getPlayerList: function () {
      return playerList;
    },

    newTimer: function () {
      var timer = $interval(function () {
        timerCallback(timer);
      }, 1000);
    },

    setTimerCallback: function (func) {
      timerCallback = func;
    }
  };
});
