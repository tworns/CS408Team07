angular.module('yoodle')

.controller('SettingsModalCtrl', function($scope, $rootScope, localStorageService, toastr) {
  $scope.username = localStorageService.get('username');

  $scope.dismissModal = function() {
    $rootScope.modalInstance.close();
  };

  $scope.saveSettings = function() {
    if ($scope.username.length > 0) {
      // Save the username to local storage
      localStorageService.set('username', $scope.username);

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
