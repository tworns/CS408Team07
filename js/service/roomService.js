angular.module('yoodle')

.factory('roomService', function () {
  var roomID = '';
  var IDCallback;

  var playerList;
  var playerListCallback;

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
    }
  };
});
