angular.module('yoodle')

.controller('Gallery', function($scope, $rootScope, $location, $window, $interval, localStorageService, roomService) {
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  var slides = $scope.slides = [];
  var currIndex = 0;
  var piclist = JSON.parse(localStorage.getItem("piclist"));
  var picnamelist = JSON.parse(localStorage.getItem("picnamelist"));

  $scope.addSlide = function(pic,picname) {
    var newWidth = 600 + slides.length + 1;
    slides.push({
      image: pic,
      text: picname,
      id: currIndex++
    });
  };

  if(piclist.length !== 0){
    for (var i = 0; i < piclist.length; i++) {
      $scope.addSlide(piclist[i], picnamelist[i]);
    }
  }
  else{console.log('list is empty');}
});
