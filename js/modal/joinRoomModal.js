angular.module('yoodle')

.controller('JoinRoomModalCtrl', function($scope, $rootScope, $location, localStorageService, roomIDService) {
  // TODO display error when unable to connect (becuase wrong room code or invalid username)
  $scope.submitRoomCode = function() {
    roomIDService.set($scope.roomCode);

    $rootScope.socket.emit('joinRoom', roomIDService.get(), localStorageService.get('username'));
    console.log('Joining ' + roomIDService.get() + ', name ' + localStorageService.get('username'));

    $rootScope.modalInstance.close();
  };
});
