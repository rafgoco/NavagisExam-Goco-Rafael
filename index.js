import * as testing from "./test.js"


function addMarker(latLng) {
    let marker = new google.maps.Marker({
        map: map,
        position: latLng,
        draggable: true
    });
  
    //store the marker object drawn on map in global array
    markersArray.push(marker);
  }