 
 //update numbers for range scan based on slider
 function showNumber(newNumber)
 {
    document.getElementById("range").innerHTML=newNumber;
 
 }
 
 //update numbers for how many items to display based on slider
  function showItemNumber(newNumber)
 {
    document.getElementById("itemCount").innerHTML=newNumber;
 
 }
 
 
 //Implementation of map -Mark-
 //This may not be used, as Adi's map likely has better functionality. Still
 //I feel it is good to record our older versions
 function myMap() {


  var mapCanvas = document.getElementById("map");
  var mapOptions = 
    {
    //center is hardcoded to ucf right now, this will
    //eventually be updated to automaticall locate and change
    //the lat and long to the users exact position
    //Updated: Adi's is able to handle Geoloaction updating
        center: new google.maps.LatLng(28.6024, -81.2001),
        zoom: 15,
        
        
        //disabled unnecessary map controls to keep it simple
        //Updated: These settings might actually still be useful to move over
        //into Adi's map
       disableDefaultUI: true,
       zoomControl: true,
       panControl: true,
       scaleControl:true,
       rotateControl: true
       
    }
  var map = new google.maps.Map(mapCanvas, mapOptions);
  
  //listener needs to be added to marker once we have the info page
  //set up. The listener should activate a link to the page on click
  var marker = new google.maps.Marker({position: mapOptions.center});
        marker.setMap(map);
        
  var scanRadiusDisplay = new google.maps.Circle(
  {
    center: mapOptions.center,
    //the radius is just a hard coded number for now
    //this will eventually be linked to the settings the user
    //adjusted to
    //Updated: This will be easy since we have the scripts for the sliders and it will
    // just be a matter of assigning variables
    radius: 200,
    strokeColor: "#008000",
    strokeOpacity: 0.9,
    strokeWeight: 1,
    fillColor: "#ADFF2F",
    fillOpacity: 0.4
  });
    scanRadiusDisplay.setMap(map);
 
 
        //Trying to make an instance for a nearby search of stores
        //Updated: This is broken, Adi's version works, so we will use his
        var realScan = new google.maps.places.PlacesService(map);
        realScan.nearbySearch({
          location: mapOptions.center,
          radius: 3000,
          type: ['store']
        }, getMarkerParameters);
        realScan.setMap(map);

}

//Loop which should create x number of markers
function getMarkerParameters(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            addMarker(results[i]);
          }
        }
      }
      
      
 //Loop which adds the markers based on total number constraints  
    //Update: This is probably obsolete after Adi's thing
function addMarker(place) {
        var marker = new google.maps.Marker({
          map: myMap.map,
          position: place.geometry.location
        });
      }
      
      
      
