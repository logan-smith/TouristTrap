angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, SettingsUpdate) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
  });  

  $scope.rangeValue = "8";

  $scope.update = function(value) {
    SettingsUpdate.setRangeValue(value);
    $scope.modal.hide();
  };

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

})

.controller('MapCtrl', function($scope, $ionicLoading, SettingsUpdate) {

    $scope.initialise = function() {

        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            
            //disabled some stuff on the UI since it was causing clutter
            disableDefaultUI: true,
            zoomControl: true,
            panControl: true,
            scaleControl:true,
            rotateControl: true
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        
        //Times 1500 to account for whatever weird units google expects.
        $scope.rangeValue = 1500*parseFloat(SettingsUpdate.getRangeValue());

        var scanRadiusDisplay = new google.maps.Circle(
            {
                center: mapOptions.myLatlng,
                radius: $scope.rangeValue,
                strokeColor: "#008000",
                strokeOpacity: 0.9,
                strokeWeight: 1,
                fillColor: "#ADFF2F",
                fillOpacity: 0.2
            });
            
        scanRadiusDisplay.setMap(map);
            

        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log(pos);
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            scanRadiusDisplay.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });

        $scope.map = map;
    };
    
    google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise());

    $scope.$on('eventFired', function(event, data) {
        $scope.initialise();
    })

});

