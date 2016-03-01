angular.module('yoodle')

.controller('PlayCtrl', function($scope, $rootScope, $location, $window, $interval, localStorageService, roomService) {
  $scope.canvas = document.getElementById('canvas');
  $scope.ctx = $scope.canvas.getContext('2d');

  var interval;
  var lastX;
  var lastY;
  var currX;
  var currY;
  var drawing = false;
  $scope.canvas.onmousedown = function(e){
    console.log('artistDown!\n');
        $rootScope.socket.emit('artistDrawDown',e.pageX,e.pageY, roomService.getRoomID());
        //$scope.onArtistDrawDown(e.pageX,e.pageY);
  $scope.canvas.onmousemove = function(e) {
        //  interval = $interval(function () {
            $rootScope.socket.emit('artistDrawMove',e.pageX,e.pageY,roomService.getRoomID());
          //  $scope.onArtistDrawMove(e.pageX,e.pageY);
        //});
        };
};

  $scope.canvas.onmouseup = function(e) {
    console.log("Hit mouseup");
    $rootScope.socket.emit('artistDrawStop',roomService.getRoomID());
    //$interval.cancel(interval);
  };

$rootScope.socket.on('artistDrawDown',function(x,y){
console.log("I'm going to draw!\n");
$scope.lastX = x;
$scope.lastY = y;
$scope.ctx.beginPath();
$scope.drawing = true;

});
$rootScope.socket.on('artistDraw',function(x,y){

if($scope.drawing) {
  console.log("I'm drawing!\n");
$scope.currX = x;
$scope.currY = y;
$scope.ctx.moveTo($scope.lastX,$scope.lastY);
$scope.ctx.lineTo($scope.currX,$scope.currY);
  $scope.ctx.strokeStyle = "#4bf";
  $scope.ctx.stroke();
  $scope.lastX = $scope.currX;
  $scope.lastY = $scope.currY;
}

});
$rootScope.socket.on('artistDrawStop', function(){
  $scope.drawing = false;
});

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
