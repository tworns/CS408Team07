angular.module('yoodle')

.controller('PlayCtrl', function($scope, $interval) {
  $scope.time = 60;

  $scope.timer = $interval(function () {
    $scope.time -= 1;

    if ($scope.time <= 0) {
      $interval.cancel($scope.timer);
    }
  }, 1000);
});
