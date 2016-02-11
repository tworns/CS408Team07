angular.module('yoodle')

.controller('AppCtrl', function($scope, $rootScope, $location, $uibModal, localStorageService) {
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
})

.controller('UsernameModalCtrl', function($scope, $rootScope, localStorageService) {
  $scope.submitUsername = function() {
    // Save the username to local storage
    localStorageService.set('username', $scope.username);

    // Close the modal
    $rootScope.modalInstance.close();
  };
})

.controller('SettingsModalCtrl', function($scope, $rootScope, localStorageService) {
  $scope.username = localStorageService.get('username');

  $scope.dismissModal = function() {
    $rootScope.modalInstance.close();
  };

  $scope.saveSettings = function() {
    // TODO save other settings here
    localStorageService.set('username', $scope.username);

    // Close the modal
    $rootScope.modalInstance.close();
  };
});
