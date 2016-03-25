angular.module('yoodle')

.controller('SettingsModalCtrl', function($scope, $rootScope, localStorageService, toastr) {
  $scope.username = localStorageService.get('username');
  $scope.serverIP = localStorageService.get('serverIP') || '127.0.0.1';

  $scope.dismissModal = function() {
    $rootScope.modalInstance.close();
  };

  $scope.saveSettings = function() {
    if ($scope.username.length > 0) {
      // Save the username and IP to local storage
      localStorageService.set('username', $scope.username);
      localStorageService.set('serverIP', $scope.serverIP);

      // Retry connection to server now that IP has been changed
      if (!$rootScope.socket.connected) {
        $rootScope.socket= io('http://' + $scope.serverIP + ':3001', {
          'connect timeout': 5000
        });
      }

      // Close the modal
      $rootScope.modalInstance.close();

      // Display a success toast
      toastr.success('Settings saved!', 'Success');
    }
    else {
      toastr.error('Usernames can\'t be empty', 'Try again');
    }
  };
});
