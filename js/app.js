angular.module('yoodle', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider

  .when('/app', {
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .when('/app.play', {
    templateUrl: 'templates/play.html',
    controller: 'PlayCtrl'
  })

  .otherwise({
    redirectTo: '/app'
  });
})

.run(function() {

});
