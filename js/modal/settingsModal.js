angular.module('yoodle')

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
