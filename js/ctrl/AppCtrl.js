angular.module('yoodle')

.controller('AppCtrl', function($scope, $rootScope, $location, $timeout, $uibModal, toastr, localStorageService) {
  $scope.changeView = function(view) {
    $location.path(view);
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
  $scope.connectionStatus = {
    color: 'yellow'
  };

  var socket = io('http://localhost:3001', {
    'connect timeout': 5000
  });

  socket.on('connect', function () {
    console.log('Connected to server');

    // Must be wrapped in a timeout to update in the next digest
    $timeout(function () {
      $scope.connectionStatus = {
        color: 'green'
      };
    });

    socket.on('message', function (msg) {
      console.log(msg);
    });

    socket.on('emit', function() {

    });
  });

  socket.on('connect_error', function(err) {
    toastr.error('Unable to connect to the server.', err.type);
    $timeout(function () {
      $scope.connectionStatus = {
        color: 'green'
      };
    });
  });
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
