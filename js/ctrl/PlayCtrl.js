angular.module('yoodle')

.controller('PlayCtrl', function($scope, $interval) {
  $scope.canvas = document.getElementById('canvas');
  $scope.ctx = $scope.canvas.getContext('2d');

  $scope.time = 60;

  $scope.timer = $interval(function () {
    $scope.time -= 1;

    if ($scope.time <= 0) {
      $interval.cancel($scope.timer);
    }
  }, 1000);

  $scope.clearCanvas = function() {
    $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
  };

  $scope.savaImage = function() {
    $scope.image = $scope.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href=$scope.image;
  };

  // Server connection
  var socket = io('http://localhost:3001');
  socket.on('connect', function () {
    console.log('Connected to server');
    socket.send($scope.userName); //need to send player name, address, and whether or not that player is the artist

    socket.on('message', function (msg) {
      console.log(msg);
    });
  });
})

.directive("drawing", function(){
  return {
    restrict: "A",
    link: function(scope, element){
      var ctx = element[0].getContext('2d');

      // variable that decides if something should be drawn on mousemove
      var drawing = false;

      // the last coordinates before the current move
      var lastX;
      var lastY;

      element.bind('mousedown', function(event){
        if(event.offsetX!==undefined){
          lastX = event.offsetX-45;
          lastY = event.offsetY-45;
        } else {
          lastX = event.layerX - event.currentTarget.offsetLeft;
          lastY = event.layerY - event.currentTarget.offsetTop;
        }

        // begins new line
        ctx.beginPath();

        drawing = true;
      });
      element.bind('mousemove', function(event){
        if(drawing){
          // get current mouse position
          if(event.offsetX!==undefined){
            currentX = event.offsetX-45;
            currentY = event.offsetY-45;
          } else {
            currentX = event.layerX - event.currentTarget.offsetLeft;
            currentY = event.layerY - event.currentTarget.offsetTop;
          }

          draw(lastX, lastY, currentX, currentY);

          // set current coordinates to last one
          lastX = currentX;
          lastY = currentY;
        }

      });
      element.bind('mouseup', function(event){
        // stop drawing
        drawing = false;
      });

      function draw(lX, lY, cX, cY){
        // line from
        ctx.moveTo(lX,lY);
        // to
        ctx.lineTo(cX,cY);
        // color
        ctx.strokeStyle = "#4bf";
        // draw it
        ctx.stroke();
      }

      // canvas reset
      function reset(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        //using the width = width method is slower than the clearRect.
       //element[0].width = element[0].width;
      }
    }
  };
});
