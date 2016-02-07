angular.module('yoodle', ['ui.bootstrap','ngRoute','picardy.fontawesome'])

.config(function($routeProvider) {
  $routeProvider

  .when('/app', {
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .when('/play', {
    templateUrl: 'templates/play.html',
    controller: 'PlayCtrl'
  })

  .otherwise({
    redirectTo: '/app'
  });
})

.run(function() {

});
