angular.module('yoodle')

.controller('JoinRoomModalCtrl', function($scope, $rootScope, $location, localStorageService, roomService) {
  // TODO display error when unable to connect (becuase wrong room code or invalid username)
  $scope.submitRoomCode = function() {
    roomService.setRoomID($scope.roomCode);

    $rootScope.socket.emit('joinRoom', roomService.getRoomID(), localStorageService.get('username'));
    console.log('Joining ' + roomService.getRoomID() + ', name ' + localStorageService.get('username'));

    $rootScope.modalInstance.close();
  };
});
