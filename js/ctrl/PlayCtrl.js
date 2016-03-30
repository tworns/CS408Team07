angular.module('yoodle')

.controller('PlayCtrl', function($scope, $rootScope, $location, $window, $interval, localStorageService, roomService, toastr) {
  $scope.canvas = document.getElementById('canvas');
  $scope.ctx = $scope.canvas.getContext('2d');

  $rootScope.clearCtx = function() {
    $scope.ctx.clearRect(0,0,canvas.width, canvas.height);
  };

  var interval;
  var lastX;
  var lastY;
  var currX;
  var currY;
  var drawing = false;

  $scope.canvas.onmousedown = function(e){
    //if ($rootScope.isArtist && $rootScope.gameStarted) {
      var x, y;
      $scope.ctx.beginPath();
      $scope.ctx.moveTo(x,y);
      $scope.ctx.lineWidth = 2;
      $scope.ctx.lineTo(x+5,y);
      $scope.ctx.strokeStyle = "#4bf";
      $scope.ctx.stroke();
      if(e.offsetX!==undefined){
        x = e.offsetX-30;
        y = e.offsetY-30;
      } else {
        x = e.layerX - e.currentTarget.offsetLeft;
        y = e.layerY - event.currentTarget.offsetTop;
      }

      $rootScope.socket.emit('artistDrawDown', x, y, roomService.getRoomID());
        $rootScope.socket.emit('artistDrawDown', x, y, roomService.getRoomID());
      $scope.canvas.onmousemove = function(e) {
      //  if($rootScope.isArtist && $rootScope.gameStarted){
        if (e.offsetX !== undefined){
          x = e.offsetX;
          y = e.offsetY;
        } else {
          x = e.layerX - e.currentTarget.offsetLeft;
          y = e.layerY - event.currentTarget.offsetTop;
        }

        $rootScope.socket.emit('artistDrawMove',x,y,roomService.getRoomID());
      //}
      };
    //}
  };

  $scope.canvas.onmouseup = function(e) {
    $rootScope.socket.emit('artistDrawStop',roomService.getRoomID());
  };

  $rootScope.socket.on('artistDrawDown',function(x,y,e){
    $scope.lastX = x;
    $scope.lastY = y;
    $scope.ctx.beginPath();
    $scope.drawing = true;
  });

  $rootScope.socket.on('artistDraw',function(x,y){

    if($scope.drawing) {
      $scope.ctx.beginPath();
      $scope.currX = x;
      $scope.currY = y;
      $scope.ctx.moveTo($scope.lastX,$scope.lastY);
      $scope.ctx.lineWidth = 2;
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

  $rootScope.socket.on('artistClear',function(){
    console.log('trying to clear (client)');
    $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
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


  $scope.time = 0;
  roomService.setTimerCallback(function (t) {
    if (t < 0) {
      $scope.time = 0;
    }
    else {
      $scope.time = t;
    }

    if(document.getElementById("bar") !== null) {
      document.getElementById("bar").style.width = ($scope.time) / roomService.getMaxTime() * 100 + "%";
      document.getElementById("bar").innerHTML = ($scope.time) / roomService.getMaxTime() * 100 + "%";
    }
  });

  $rootScope.socket.on('newWord', function (word) {
    $scope.currentWord = word;
    $scope.length = $scope.currentWord.length;
    $scope.ltext = "Word Length: ";
  });

  $scope.goGallery = function () {
    // Let the server know we left the game
    $rootScope.socket.emit('leaveRoom', roomService.getRoomID(), $scope.username);

    // Perform some cleanup on global vars. Local scope will be recreated next time we join/create a game
    roomService.cleanup();

    $location.path('end');
  };

  $scope.backToMenu = function () {
    // Let the server know we left the game
    $rootScope.socket.emit('leaveRoom', roomService.getRoomID(), $scope.username);

    // Perform some cleanup on global vars. Local scope will be recreated next time we join/create a game
    roomService.cleanup();

    $location.path('app');

    $rootScope.socket.disconnect();
  };

  $scope.startGame = function () {
    $rootScope.socket.emit('startGame', roomService.getRoomID());
  //  $rootScope.socket.emit('artistClear',roomService.getRoomID);
  };

  $scope.clearCanvas = function () {
    $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
    //trying to clear all canvases when artist clears his.
    console.log('Clear button pressed.');
    $rootScope.socket.emit('artistClear',roomService.getRoomID);
  };

  $scope.saveImage = function () {
    $scope.image = $scope.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    //window.location.href=$scope.image;

    var lnk = document.createElement('a'),
        e;

    /// the key here is to set the download attribute of the a tag
    lnk.download = "untitled.png";

    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    lnk.href = $scope.image;

    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {

        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
                         0, 0, 0, 0, 0, false, false, false,
                         false, 0, null);

        lnk.dispatchEvent(e);

    } else if (lnk.fireEvent) {

        lnk.fireEvent("onclick");
    }

  };

  $scope.sendGuess = function () {
    $rootScope.socket.emit('guess', $scope.guess, $scope.username);
    $scope.guess = '';
  };

  var lastSkipped = (new Date()).getTime();
  $scope.skipWord = function () {
    // Only let the artist skip words
    var currTime = (new Date()).getTime();
    if ($rootScope.isArtist && currTime - lastSkipped > 1000) {
      lastSkipped = currTime;

      $rootScope.socket.emit('newWord');
      $rootScope.socket.emit('skippedWord');
      $rootScope.socket.emit('artistClear');
    }
  };

  // Make sure to leave the game before closing the window!
  window.onbeforeunload = function (e) {
    if ($rootScope.socket.connected) {
      $rootScope.socket.emit('leaveRoom', roomService.getRoomID(), $scope.username);
    }

    return true;
  };

  //gallery
  var piclist = [];
  var picnamelist = [];
  localStorage.setItem("piclist", JSON.stringify(piclist));
  localStorage.setItem("picnamelist", JSON.stringify(picnamelist));

  var snd = new Audio("./assets/correct.wav");
  var snd2 = new Audio("./assets/wrong.wav");
  $rootScope.socket.on('correctGuess', function (name, word) {
    snd.play();
    if (localStorageService.get('username') === name) {
      toastr.success('You guessed it right!', 'Congrats!');
    }
    else {
      toastr.success(name + ' guessed the word correctly!  It was "' + word + '"', 'Correct!');
    }

    piclist = JSON.parse(localStorage.getItem("piclist"));
    piclist.push($scope.canvas.toDataURL());
    localStorage.setItem("piclist", JSON.stringify(piclist));

    picnamelist = JSON.parse(localStorage.getItem("picnamelist"));
    picnamelist.push($scope.currentWord);
    localStorage.setItem("picnamelist", JSON.stringify(picnamelist));
  });

  $rootScope.socket.on('gameEnd', function () {
    $scope.goGallery();
  });

});
