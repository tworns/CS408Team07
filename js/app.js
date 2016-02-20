angular.module('yoodle', ['ui.bootstrap','ngRoute', 'ngAnimate', 'picardy.fontawesome', 'toastr', 'LocalStorageModule'])

.config(function($routeProvider, localStorageServiceProvider) {
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

  localStorageServiceProvider.setPrefix('yoodle');
})

.run(function() {

})

.factory('roomIDService', function () {
  var roomID = '';

  return {
    set: function (id) {
      roomID = id;
    },
    get: function () {
      return roomID;
    }
  };
});
