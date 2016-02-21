angular.module('yoodle')

.controller('PlayCtrl', function($scope, $rootScope, $interval, $location, $window, localStorageService, roomService) {
  $scope.canvas = document.getElementById('canvas');
  $scope.ctx = $scope.canvas.getContext('2d');

  $scope.username = localStorageService.get('username');

  $scope.roomID = roomService.getRoomID();
  roomService.setRoomIDCallback(function(id) {
    $scope.roomID = id;
  });

  $scope.currentWord = "";
  $scope.wordList = ["apple", "bomb", "car", "dog", "electricity", "frog", "ghost", "hockey",
    "island", "justice", "king", "light", "music", "nature", "outside", "photograph", "queen",
    "roller blade", "spring", "thief", "unicycle", "vase", "water", "x-ray", "yo-yo", "zebra"];
  $scope.usedWords = [];

  $scope.time = 60;
  $scope.timer = $interval(function () {
    $scope.time--;

    if ($scope.time <= 0) {
      $interval.cancel($scope.timer);
    }
  }, 1000);

  $scope.backToMenu = function() {
    $rootScope.socket.emit('leaveRoom', roomService.getRoomID(), $scope.username);
    roomService.setRoomID('');

    $location.path('app');
  };

  $scope.clearCanvas = function() {
    $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
  };

  $scope.savaImage = function() {
    $scope.image = $scope.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href=$scope.image;
  };

  $scope.sendGuess = function() {
    var guess = $scope.guess;
    $scope.guess = "";
    socket.send(guess);
  };

  $scope.skipWord = function() {
    var newWord = $scope.wordList[Math.floor((Math.random() * $scope.wordList.length))];
    $scope.usedWords.push(newWord);
    $scope.currentWord = newWord;
  };

  // Make sure to leave the game before closing the window!
  window.onbeforeunload = function (e) {
    if ($rootScope.socket.connected) {
      $rootScope.socket.emit('leaveRoom', roomService.getRoomID(), $scope.username);
    }

    return true;
  };
});
