angular.module('yoodle')

.factory('roomService', function () {
  var roomID = '';
  var callback;

  return {
    setRoomIDCallback: function(func) {
      callback = func;
    },

    setRoomID: function (id) {
      roomID = id;

      if (callback) {
        callback(roomID);
      }
    },

    getRoomID: function () {
      return roomID;
    }
  };
});
