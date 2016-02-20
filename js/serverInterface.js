angular.module('yoodle')

.factory('serverInterfaceService', function () {
  return {
    init: function ($scope, $rootScope, $timeout, roomIDService) {
      $scope.connectionStatus = {
        color: 'yellow'
      };

      $rootScope.socket= io('http://localhost:3001', {
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
          roomIDService.set(roomID);

          $rootScope.socket.emit('joinRoom', roomID, $scope.username);
        });
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
