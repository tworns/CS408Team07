angular.module('yoodle')

.controller('PlayCtrl', function($scope, $rootScope, $location, $window, $interval, localStorageService, roomService) {
  $scope.canvas = document.getElementById('canvas');
  $scope.ctx = $scope.canvas.getContext('2d');

  var interval;
  $scope.canvas.onmousedown = function(e){
    interval = $interval(function () {
      $rootScope.socket.emit('artistDraw', e.pageX, e.pageY, roomService.getRoomID());
    }, 67);
  };
  $scope.canvas.onmouseup = function(e) {
    console.log("Hit mouseup");
    $interval.cancel(interval);
  };

  $scope.username = localStorageService.get('username');

  $scope.roomID = roomService.getRoomID();
  roomService.setRoomIDCallback(function (id) {
    $scope.roomID = id;
  });

  $scope.playerList = roomService.getPlayerList();
  roomService.setPlayerListCallback(function (list) {
    $scope.playerList = list;
    $scope.$apply();
  });

  $scope.time = 60;
  roomService.setTimerCallback(function (timer) {
    $scope.time--;

    if ($scope.time <= 0) {
      $interval.cancel(timer);
    }
  });

  $rootScope.socket.on('newWord', function (word) {
    $scope.currentWord = word;
  });

  $scope.usedWords = [];

  $scope.backToMenu = function () {
    $rootScope.socket.emit('leaveRoom', roomService.getRoomID(), $scope.username);
    roomService.setRoomID('');

    $location.path('app');
  };

  $scope.startGame = function () {
    $rootScope.socket.emit('startGame', roomService.getRoomID());
  };

  $scope.clearCanvas = function () {
    $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
  };

  $scope.savaImage = function () {
    $scope.image = $scope.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href=$scope.image;
  };

  $scope.sendGuess = function () {
    $rootScope.socket.emit('guess', $scope.guess, roomService.getRoomID(), $scope.username);

    $scope.guess = '';
  };

  $scope.skipWord = function () {
    // Only let the artist skip words
    if ($rootScope.isArtist) {
      $rootScope.socket.emit('newWord', roomService.getRoomID());
    }
  };

  // Make sure to leave the game before closing the window!
  window.onbeforeunload = function (e) {
    if ($rootScope.socket.connected) {
      $rootScope.socket.emit('leaveRoom', roomService.getRoomID(), $scope.username);
    }

    return true;
  };
});
