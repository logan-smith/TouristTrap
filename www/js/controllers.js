angular.module('starter.controllers', ['ngCordova', 'ion-google-autocomplete'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $cordovaGeolocation, SettingsUpdate, $timeout) {

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

    // $scope.rangeValue = "6";
    $scope.rangeValue = SettingsUpdate.getRangeValue();
    $scope.toggle = "false";

    $scope.update = function(value, numPlaces, valueToggle) {
      $scope.rangeValue = value;
      $scope.toggle = valueToggle;
      console.log(" toggle is " + valueToggle);
      SettingsUpdate.setValues(value, numPlaces);
      // SettingsUpdate.setRangeValue(value);
      // SettingsUpdate.setNumPlaces(numPlaces);
      $scope.modal.hide();
    };

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $timeout($scope.openModal, 10);

    // Cleanup the modal when we're done with it!
    // $scope.$on('$destroy', function() {
    //   $scope.modal.remove();
    // });
  
  //finds current location and does a text search based on input
  $scope.doSearch = function(v) {

    //window.localStorage.removeItem("data");

    navigator.geolocation.getCurrentPosition(function(pos) {

      var centerLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      console.log(v);
      console.log("range is" + $scope.rangeValue);

      var request = {
          location: centerLocation,
          // radius: '500',
          radius: (1609 * parseInt($scope.rangeValue)),
          opennow: $scope.toggle,
          type: v
      };
      var map = new google.maps.Map(document.getElementById("map2"));
      var service = new google.maps.places.PlacesService(map);
                
      service.textSearch(request, callback);
    });
  }

 

  $scope.groups = [
    { name: 'Food', id: 1, items: [{subName: 'restaurant',subId: 'restaurant'}, {subName: 'cafe',subId: 'cafe'}, {subName: 'bakery',subId: 'bakery'}]},
    { name: 'Tourism', id: 2, items: [{subName: 'aquarium',subId: 'aquarium'}, {subName: 'natural feature',subId: 'natural_feature'}, {subName: 'museum',subId: 'museum'}]},
    { name: 'Worship', id: 3, items: [{subName: 'church',subId: 'church'}, {subName: 'mosque',subId: 'mosque'}, {subName: 'synagogue',subId: 'synagogue'}]},
    { name: 'Outdoors', id: 4, items: [{subName: 'campground',subId: 'campground'}, {subName: 'park',subId: 'park'}, {subName: 'rv park',subId: 'rv_park'}]},
    { name: 'Shopping', id: 5, items: [{subName: 'jewelry store',subId: 'jewelry_store'}, {subName: 'liquor store',subId: 'liquor_store'},{ subName: 'shopping mall', subId: 'shopping_mall'}]},
    { name: 'Services', id: 6, items: [{subName: 'hair care',subId: 'hair_care'}, {subName: 'bank',subId: 'bank'},{ subName: 'lodging', subId: 'lodging'}, { subName: 'car rental', subId: 'car_rental'}]}
  ];
  
  
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

})

//controller for search page
.controller('SearchCtrl', function($scope, $ionicModal, $cordovaGeolocation) {

  $scope.data = {};

  //get location from autocomplete input, store in local storage?
  $scope.onAddressSelection = function(location) {
    var a = location.address_components;
    console.log("from search: " + JSON.stringify(a));

    window.localStorage.setItem("autocompleteData", JSON.stringify(a));
  }

  $scope.loadData = function() {
    alert(window.localStorage.getItem("data"));
  }

    //clear any leftover data
  $scope.clearData = function(){
    window.localStorage.removeItem("data");
  }

})

//Map Controller
.controller('MapCtrl', function($scope, $ionicLoading, SettingsUpdate) {

    $scope.loadData = function() {
      alert(window.localStorage.getItem("data"));
    }

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

        var map = new google.maps.Map(document.getElementById("map3"), mapOptions);
        
        //Times 1609 to account for meters to miles.
        $scope.rangeValue = 1609*parseFloat(SettingsUpdate.getRangeValue());

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

        //load data here
        var dataString = window.localStorage.getItem("data");
        //convert to json
        var placesFound = JSON.parse(dataString);

        console.log(placesFound);
        $scope.numPlaces = SettingsUpdate.getNumPlaces();
        // if (placesFound.length > $scope.numPlaces) {
        //   placesFound = placesFound.slice(0, $scope.numPlaces);
        // } 

            

        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log(pos);
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            scanRadiusDisplay.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location",
                label: 'My Location'
            });

            

            //search location markers
            for (var i=0; i<placesFound.length; i++){
              
              //var locationDetails = {name: placesFound[i].name, address: placesFound[i].formatted_address};
              var locationDetails = placesFound[i].name;
              console.log(locationDetails);

              var marker = new google.maps.Marker({
                map: $scope.map,
                position: placesFound[i].geometry.location,
                title: placesFound[i].name + '<br>' + placesFound[i].formatted_address
              });

              
              var infoWindow = new google.maps.InfoWindow();
              
              
              google.maps.event.addListener(marker, 'click', function () {
                  infoWindow.open($scope.map, marker);
              });                  
              
              //set listener to open infowindow with marker title information
              marker.addListener('click', function(){
                infoWindow.setContent(this.title);
                infoWindow.open($scope.map, this);
              });
            }
            
            
        });

        $scope.map = map;
    };
    
    google.maps.event.addDomListener(document.getElementById("map3"), 'load', $scope.initialise());

    $scope.$on('eventFired', function(event, data) {
        $scope.initialise();
    })

})

//Browse Controller
.controller("BrowseCtrl", function($scope) {

  var a = window.localStorage.getItem("autocompleteData");
  console.log("from browse: " + a);

});

function callback(results, status) {
  //console.log(status);

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      //console.log(place);
    }
  }
  else {
    console.log("error");
  }

  //console.log(results);
  window.localStorage.setItem("data", JSON.stringify(results));
}