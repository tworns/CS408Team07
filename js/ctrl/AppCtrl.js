angular.module('yoodle')

.controller('AppCtrl', function($scope, $rootScope, $location, $timeout, $uibModal, toastr, localStorageService, roomIDService) {
  $scope.createGame = function () {
    if (!$rootScope.socket.connected) {
      toastr.error('Unable to connect to the server.', 'Not connected');
      return;
    }

    $rootScope.socket.emit('createRoom');

    $location.path('play');
  };

  $scope.joinGame = function () {
    if (!$rootScope.socket.connected) {
      toastr.error('Unable to connect to the server.', 'Not connected');
      return;
    }

    $location.path('play');
  };

  console.log(localStorageService.get('username'));

  if (localStorageService.get('username')) {
    $scope.username = localStorageService.get('username');
  }
  else {
    $rootScope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/usernameModal.html',
      controller: 'UsernameModalCtrl'
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
    initServerInterface($scope, $rootScope, $timeout, roomIDService);
  }
  else if ($rootScope.socket.connected) {
    $scope.connectionStatus = { color: 'green' };
  }
  else {
    $scope.connectionStatus = { color: 'red' };
  }
})

.controller('UsernameModalCtrl', function($scope, $rootScope, localStorageService) {
  $scope.submitUsername = function() {
    // Save the username to local storage
    localStorageService.set('username', $scope.username);

    // Close the modal
    $rootScope.modalInstance.close();
  };
})

.controller('SettingsModalCtrl', function($scope, $rootScope, localStorageService, toastr) {
  $scope.username = localStorageService.get('username');

  $scope.dismissModal = function() {
    $rootScope.modalInstance.close();
  };

  $scope.saveSettings = function() {
    // TODO save other settings here
    localStorageService.set('username', $scope.username);

    // Close the modal
    $rootScope.modalInstance.close();

    // Display a success toast
    toastr.success('Settings saved!', 'Success');
  };
});
