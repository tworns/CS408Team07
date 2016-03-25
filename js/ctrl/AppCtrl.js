angular.module('yoodle')

.controller('AppCtrl', function($scope, $rootScope, $location, $interval, $timeout, $uibModal, toastr, localStorageService, roomService, serverInterfaceService) {
  $scope.createGame = function () {
    if (!$rootScope.socket.connected) {
      toastr.error('Unable to connect to the server.', 'Not connected');
      return;
    }

    $rootScope.socket.emit('createRoom');
  };

  $scope.joinGame = function () {
    if (!$rootScope.socket.connected) {
      toastr.error('Unable to connect to the server.', 'Not connected');
      return;
    }

    $rootScope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/joinRoomModal.html',
      controller: 'JoinRoomModalCtrl'
    });
  };

  console.log(localStorageService.get('username'));

  if (localStorageService.get('username')) {
    $scope.username = localStorageService.get('username');
  }
  else {
    $rootScope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/settingsModal.html',
      controller: 'SettingsModalCtrl',
      backdrop: 'static',
      keyboard: false
    });

    $rootScope.modalInstance.closed
    .then(function () {
      $scope.username = localStorageService.get('username');
    });
  }

  $scope.openSettings = function() {
    $rootScope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/settingsModal.html',
      controller: 'SettingsModalCtrl'
    });

    // Modal promise: called when this modal is closed
    $rootScope.modalInstance.closed.then(function() {
      $scope.username = localStorageService.get('username');
    });
  };

  // Server connection
  if ($rootScope.socket === undefined) {
    serverInterfaceService.init($scope, $rootScope, $timeout, $interval, $location, toastr, localStorageService, roomService);
  }
  else if ($rootScope.socket.connected) {
    $scope.connectionStatus = { color: 'green' };
  }
  else {
    $scope.connectionStatus = { color: 'red' };
  }
});
