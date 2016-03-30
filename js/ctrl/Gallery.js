angular.module('yoodle')

.controller('Gallery', function($scope, $rootScope, $location, $window, $interval, localStorageService, roomService, toastr) {
  $scope.myInterval = 5000;
  $scope.slideno = 0;
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
      /*text: picname,*/
      id: currIndex++
    });
  };

  if(piclist.length !== 0){
    for (var i = 0; i < piclist.length; i++) {
      $scope.addSlide(piclist[i], picnamelist[i]);
    }
  }
  else{console.log('list is empty');}

  //back to menu
  $scope.backToMenu = function () {
    $location.path('app');
    $rootScope.socket.disconnect();
  };

  $scope.download = function () {
    /// create an "off-screen" anchor tag
    var lnk = document.createElement('a'),
        e;

    /// the key here is to set the download attribute of the a tag
    lnk.download = "untitled.png";

    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    lnk.href = piclist[$scope.slideno];

    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {

        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
                         0, 0, 0, 0, 0, false, false, false,
                         false, 0, null);

        lnk.dispatchEvent(e);

    } else if (lnk.fireEvent) {

        lnk.fireEvent("onclick");
    }
  }

});
