
let map;
var service;
var infowindow;
let markersArray = [];
let markersArrayv2 = [];
let circleArray = [];
let lalagyan = [];
let listDiv = document.getElementById("list-container-1");
let directionsService;
let directionsRenderer;
let drawingManager;
let rafcircle;
let restoCircleCount;
const url = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  const cebu = new google.maps.LatLng(10.291357, 123.878405);
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: cebu,
    zoom: 15,
    mapTypeControl: false
  });

  directionsRenderer.setMap(map);



  map.addListener('click', function (e) {

    addMarker(e.latLng);
  });

  //let url = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
  let initialMarker = new google.maps.Marker({
    map: map,
    position: cebu,
    draggable: true,
    icon: {
      url: url,
    }
  });

  //store the marker object drawn on map in global array
  // setMapOnAll2(null);
  // markersArray = [];
  markersArray.push(initialMarker);

  document
    .getElementById("rmvMarkerButt")
    .addEventListener("click", removeMarker);

  // document
  //   .getElementById("drwButt")
  //   .addEventListener("click", drawOnclick);

  document
    .getElementById("lstRstButt")
    .addEventListener("click", findNearRestaurants);

  drawingManager = new google.maps.drawing.DrawingManager({
    //drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.CIRCLE
      ]
    },
    circleOptions: {
      fillColor: "#ffff00",
      fillOpacity: .2,
      strokeWeight: 1,
      clickable: false,
      editable: true,
      zIndex: 1
    }
  });

  google.maps.event.addListener(drawingManager, 'circlecomplete', function (circle) {
    rafcircle = circle;
    var radius = circle.getRadius();
    // console.log(circle.center);
    // console.log(radius);
    drawOnclick(radius,circle.center);
    circleArray.push(circle);
  });

  drawingManager.setMap(map);

}






function createMarker(place) {
  if (!place.geometry || !place.geometry.location)
    return;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });


  markersArrayv2.push(marker);
  google.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

function addMarker(latLng) {
  //let url = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
  let marker = new google.maps.Marker({
    map: map,
    position: latLng,
    draggable: true,
    icon: {
      url: url,
    }
  });

  //store the marker object drawn on map in global array
  setMapOnAll2(null);
  markersArray = [];
  markersArray.push(marker);

  //markersArray = marker;

}

function setMapOnAll(map) {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(map);
  }
  for (var i = 0; i < markersArrayv2.length; i++) {
    markersArrayv2[i].setMap(map);
  }  
  for (var i = 0; i < circleArray.length; i++) {
    circleArray[i].setMap(map);
  }
}

function setMapOnAll2(map) {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(map);
  }
  // for (var i = 0; i < circleArray.length; i++) {
  //   circleArray[i].setMap(map);
  // }
}

function setMapOnAllv3(map) {  
  for (var i = 0; i < markersArrayv2.length; i++) {
    markersArrayv2[i].setMap(map);
  }  
  for (var i = 0; i < circleArray.length; i++) {
    circleArray[i].setMap(map);
  }
}

function removeMarker() {
  //circle.setMap(null);
  listDiv.innerHTML = "";
  listDiv.style.display = "none";
  setMapOnAll(null);
  markersArray = [];
}

function findNearRestaurants() {
  listDiv.style.display = "flex";
  listDiv.innerHTML = "";
  setMapOnAllv3(null);
  if (markersArray.length === 0) {
    alert("Click on Map to select a location");
  }
  else {
    var request = {
      location: markersArray[0].position,
      radius: '200',
      query: 'restaurant'
    };


    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
    //service.nearbySearch(request, callback);
  }

}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
     // console.log(JSON.stringify(place));
      CreateList(place, i);
      createMarker(results[i]);
      //lalagyan.push(place);
    }


  }
}

function CreateList(place, i) {

  let br = document.createElement("br");
  let newDiv = document.createElement('div');
  newDiv.id = 'lr' + i;
  newDiv.className = 'list-result';

  let newName = document.createElement('h3');
  let textnode = document.createTextNode(place.name);

  newName.appendChild(textnode);
  newDiv.appendChild(newName);

  let btn = document.createElement("BUTTON");
  let btntext = document.createTextNode("Give Directions");
  let btnID = "dirButt" + i;
  btn.className = 'feat-but testraf';
  btn.id = btnID;
  btn.value = JSON.stringify(place.geometry);

  btn.onclick = placeHolderFunc(btnID);

  //console.log(JSON.stringify(place.geometry));
  btn.appendChild(btntext);
  newDiv.appendChild(btn);
  //const deets = $'Address: {place.}';

  const address = document.createTextNode(`Address: ${place.formatted_address}`);
  const rating = document.createTextNode(`Rating: ${place.rating}`);
  const custCount = document.createTextNode(`Visited Customers : 0`);
  newDiv.appendChild(address);
  newDiv.appendChild(br);
  newDiv.appendChild(rating);
  newDiv.appendChild(br);
  newDiv.appendChild(custCount);
  document.getElementById('list-container-1').appendChild(newDiv);


  //document.appendChild(toAdd);
}

function placeHolderFunc(btnID) {
  return function () {
    const raf3 = new google.maps.LatLng(10.291357, 123.878405);

    let btnElem = document.getElementById(btnID);
    let obj = JSON.parse(btnElem.value);

    var request = {
      origin: markersArray[0].position,
      destination: obj.location,

      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(response);
      }
    });


  };
}





function drawOnclick(radVal, centerSpot) {
  // alert("clicked");
  listDiv.style.display = "flex";
  listDiv.innerHTML = "";
  document.getElementById("list-container-1").innerHTML = "";


  //let radVal = parseInt(document.getElementById("radius").value);
  // if (!Number.isInteger(radVal))
  //   radVal = 500;  

  var request = {
    location: centerSpot,
    radius: radVal,
    query: 'restaurant'
  };


  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callbackv2);


  // var request = {
  //   location: centerSpot,
  //   radius: radVal,
  //   type: 'restaurant',
  //   keyword: 'restaurant'
    
  // };


  // service = new google.maps.places.PlacesService(map);
  // service.nearbySearch(request, callbackv2);





}

function callbackv2(results, status) {
  restoCircleCount = 0;
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      //var place = results[i];      
      createMarkerCircle(results[i],i);
    }
    alert(`There are ${restoCircleCount} restaurants`);

  }
  if(restoCircleCount === 0){
    listDiv.style.display = "none";
    listDiv.innerHTML = "";
  }
    
}

function createMarkerCircle(place,i) {
  var placeLoc = place.geometry.location;
  if (google.maps.geometry.spherical.computeDistanceBetween(placeLoc, rafcircle.getCenter()) > rafcircle.getRadius())
  // if marker outside circle, don't add it to the map
    return;
  restoCircleCount++;
  CreateList(place, i);
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  // google.maps.event.addListener(marker, 'click', function() {
  //   var that = this;
  //   service.getDetails({
  //     placeId: place.place_id
  //   }, function(result, status) {
  //     infowindow.setContent(result.name + "<br>" + result.formatted_address);
  //     infowindow.open(map, that);
  //   });
  // });
  markersArrayv2.push(marker);
  //markers.push(marker);
}

window.initMap = initMap;
