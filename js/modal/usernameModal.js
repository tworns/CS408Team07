angular.module('yoodle')

.controller('UsernameModalCtrl', function($scope, $rootScope, localStorageService) {
  $scope.submitUsername = function() {
    // Save the username to local storage
    localStorageService.set('username', $scope.username);

    // Close the modal
    $rootScope.modalInstance.close();
  };
});
