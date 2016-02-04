angular.module('yoodle')

.controller('AppCtrl', function($scope, $location) {
  $scope.changeView = function(view) {
    $location.path(view);
  };
});
