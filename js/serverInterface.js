angular.module('yoodle')

.factory('serverInterfaceService', function () {
  return {
    init: function ($scope, $rootScope, $timeout, $interval, $location, toastr, localStorageService, roomService) {
      $scope.connectionStatus = {
        color: 'yellow'
      };

      var ip = localStorageService.get('serverIP') || '127.0.0.1';
      $rootScope.socket = io('http://' + ip + ':3001', {
        'connect timeout': 5000
      });

      $rootScope.socket.on('connect', function () {
        console.log('Connected to server');

        // Must be wrapped in a timeout to update in the next digest
        $timeout(function () {
          $scope.connectionStatus = {
            color: 'green'
          };
        });

        $rootScope.socket.on('roomCreated', function (roomID) {
          console.log('New room created. ID: ' + roomID);
          roomService.setRoomID(roomID);

          $rootScope.socket.emit('joinRoom', roomID, localStorageService.get('username'));
        });

        $rootScope.socket.on('roomJoined', function (success, msg) {
          if (success) {
            $rootScope.$apply(function () {
              $location.path('play');
            });
          }
          else {
            console.log('Failed to join. ' + msg);
            toastr.error(msg, 'Hmm... That didn\'t work');
          }
        });

        $rootScope.socket.on('updatePlayerList', function (list) {
          roomService.setPlayerList(list);
        });

        $rootScope.socket.on('gameStarted', function (time) {
          console.log('Game started!');

          $rootScope.gameStarted = true;
          roomService.newTimer(time);
        });

        $rootScope.socket.on('artistSelected', function (name) {
          console.log('New artist: ' + name);
          $rootScope.isArtist = false;
          if (name == localStorageService.get('username')) {
            console.log('I\'m the artist!');
            $rootScope.isArtist = true;
          }
        });
      });

      $rootScope.socket.on('minusTimer',function(){
          roomService.minusTimer(5);

          if ($rootScope.isArtist) {
            toastr.warning('You skipped the word!', '-5s!');
          }
          else {
            toastr.warning('The artist skipped the word');
          }
      });

      $rootScope.socket.on('connect_error', function(err) {
        console.log('error');
        $timeout(function () {
          $scope.connectionStatus = {
            color: 'red'
          };
        });
      });
    }
  };
});
