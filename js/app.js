angular.module('yoodle', ['ui.bootstrap','ngRoute', 'ngAnimate', 'picardy.fontawesome', 'toastr', 'LocalStorageModule'])

.config(function($routeProvider, localStorageServiceProvider) {
  $routeProvider

  .when('/app', {
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .when('/play', {
    cache: false, // Means controller will fire each time app enters /play
    templateUrl: 'templates/play.html',
    controller: 'PlayCtrl'
  })

  .when('/end', {
    templateUrl: 'templates/gallery.html',
    controller: 'Gallery'
  })

  .otherwise({
    redirectTo: '/app'
  });

  localStorageServiceProvider.setPrefix('yoodle');
})

.run(function() {

});
