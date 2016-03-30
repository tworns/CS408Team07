angular.module('yoodle')

.controller('AppCtrl', function($scope, $rootScope, $location, $interval, $timeout, $uibModal, toastr, localStorageService, roomService, serverInterfaceService) {
  $scope.createGame = function () {
    if (!$rootScope.socket.connected) {
      toastr.error('Unable to connect to the server.', 'Not connected');
      return;
    }

    $rootScope.socket.emit('createRoom',localStorageService.get('difficulty'));
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
      controller: 'SettingsModalCtrl'
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
  var initServer = function () {
    if ($rootScope.socket === undefined || ($rootScope.socket && !$rootScope.socket.connected)) {
      serverInterfaceService.init($scope, $rootScope, $timeout, $interval, $location, toastr, localStorageService, roomService);
    }

    if ($rootScope.socket && $rootScope.socket.connected) {
      $scope.connectionStatus = { color: 'green' };
    }
    else {
      $scope.connectionStatus = { color: 'red' };
    }
  };

  initServer();
});
