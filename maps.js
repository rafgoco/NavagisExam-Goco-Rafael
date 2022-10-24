
let map;
var service;
var infowindow;
let markersArray = []; 
let markersArrayv2 = []; 
let lalagyan = []; 
let listDiv = document.getElementById("list-container-1");
let directionsService;
let directionsRenderer;

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

    //pang add location
    map.addListener('click', function(e) {
      //console.log(e.latLng);
      addMarker(e.latLng);
    });

    document
    .getElementById("rmvMarkerButt")
    .addEventListener("click", removeMarker);

    document
    .getElementById("drwButt")
    .addEventListener("click", drawOnclick);
    
    document
    .getElementById("lstRstButt")
    .addEventListener("click", findNearRestaurants);

   
   
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
  let url = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";  
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
}

function setMapOnAll2(map) {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(map);
  } 
}

function removeMarker()
{
  listDiv.innerHTML = "";
  listDiv.style.display = "none";
  setMapOnAll(null);
  markersArray = [];
}

function findNearRestaurants()
{
  listDiv.style.display = "flex";
  if(markersArray.length === 0)
  {
    alert("Click on Map to select a location");
  }
  else
  {
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
      //console.log(place)
      CreateList(place,i);    
      createMarker(results[i]);
      //lalagyan.push(place);
    }
    
    
  }
}

function CreateList(place,i){
  
  let br = document.createElement("br");
  let newDiv = document.createElement('div');
  newDiv.id = 'lr'+i;
  newDiv.className = 'list-result';
  
  let newName = document.createElement('h3');
  let  textnode = document.createTextNode(place.name);

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

function placeHolderFunc(btnID){
  return function(){
    const raf3 = new google.maps.LatLng(10.291357, 123.878405);
     
    let btnElem = document.getElementById(btnID);    
    let obj = JSON.parse(btnElem.value); 
   
    var request = {
      origin: markersArray[0].position,
      destination: obj.location,
      
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(response);
    }
  });


  };
}





function drawOnclick() {
  // alert("clicked");
  listDiv.style.display = "flex";
  document.getElementById("list-container-1").innerHTML = "";
  if(markersArray.length === 0)
  {
    alert("Click on Map to select a location");
  }
  else
  {
    
    let radVal = parseInt(document.getElementById("radius").value);
    if(!Number.isInteger(radVal))
      radVal = 500;
    var antennasCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,      
      center: markersArray[0].position,
      
      radius: radVal
    });
    
    map.fitBounds(antennasCircle.getBounds());

    var request = {
      location: markersArray[0].position,
      radius: radVal,
      query: 'restaurant'
    };
  
  
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callbackv2);


  }


}

function callbackv2(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];  
      CreateList(place,i);    
      createMarker(results[i]);
    }
    alert(`There are ${results.length} restaurants`);
   
  }
}



window.initMap = initMap;
