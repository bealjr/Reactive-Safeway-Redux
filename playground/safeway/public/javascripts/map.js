function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  let sanFrancisco = {lat:37.773972,lng:-122.431297};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13.3,
    center: sanFrancisco
  });

  directionsDisplay.setMap(map);

  var onClickHandler = function(){
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };

  document.getElementById('submit').addEventListener('click', onClickHandler);

  // document.getElementById('end').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  let origin = document.getElementById("start").value,
    destination = document.getElementById("end").value;

  $.post('/directions',
    {
      origin,
      destination
    },

  function(returnObj, status){
    alert(returnObj);
    let waypointArray = returnObj;
    console.log("$#%^$%^#$%^#%$^#$%^", waypointArray);

    directionsService.route({
      origin: origin,
      destination: destination,
      waypoints: waypointArray,
      travelMode: 'WALKING'
    },

    function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  })
}
