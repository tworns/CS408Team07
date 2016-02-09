angular.module('yoodle')

.controller('AppCtrl', function($scope, $rootScope, $location, $uibModal) {
  $scope.changeView = function(view) {
    $location.path(view);
  };

  $rootScope.modalInstance = $uibModal.open({
    animation: true,
    templateUrl: 'templates/usernameModal.html',
    controller: 'UsernameModalCtrl',
    resolve: {
      items: function () {
        return ['Submit'];
      }
    }
  });
})

.controller('UsernameModalCtrl', function($scope, $rootScope) {
  $scope.submitUsername = function() {
    $rootScope.username = $scope.username;
    $rootScope.modalInstance.close();
  }
});
