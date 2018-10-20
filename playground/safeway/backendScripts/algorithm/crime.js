const crimeData = require('../cache/cleanCrimeData1.json');
const request = require('request');
const rp = require('request-promise');

// var streetGraph = require("./streetNode.js");
const fs = require('fs');
const intersectionsObject = require('./json/intersectionsObject.json');
const cnnObject = require('./json/newCnnObject.json');
const graph = require('./graph.js');

const incidents = {};
const crimeTypes = [];
//These crimeValues were set arbitrarily with a little bit of trial
const crimeValues = {
  ASSAULT: .25,
  'MISSING PERSON': .25,
  ROBBERY: .25,
  ARSON: .0625,
  'VEHICLE THEFT': .125,
  'LARCENY/THEFT': .1875,
  WARRANTS: .0625,
  BURGLARY: .0625,
  TRESPASS: .0625,
  VANDALISM: .0625,
  'DRUG/NARCOTIC': .125,
  'STOLEN PROPERTY': .0625,
  KIDNAPPING: .5,
  DRUNKENNESS: .0625,
  'DRIVING UNDER THE INFLUENCE': .0625,
  'SEX OFFENSES, FORCIBLE': .3125,
  PROSTITUTION: .0625,
  'SECONDARY CODES': .0625,
  'WEAPON LAWS': .5,
  'DISORDERLY CONDUCT': .0625,
  'FAMILY OFFENSES': .0625,
};
// var intersectionsObject = JSON.parse(intersectionsObjectJSON);
// var cnnObject = JSON.parse(cnnObjectJSON);
//
// //
// setInterval(function(){
// }, 1000 * 60 * 60);

crimeParser2(crimeData);

// 1 * 60 * 60 * 1000
//
// crimeData.data.length = 50213
//
// //There are 50,213 crimes in our data set.  The CrimeParser function iterates through these crimes and separates them into two categories based on how they were reported by police.  The first way police report the address of a crime is by specifiying the block that the crime occurred on, eg: "800 Block of Bryant St".  The second way police report the address of a crime is by specifying the cross streets, eg, "Bryant st/6th st".  In both cases, we want to figure out where the crime occurred in the city so that we can assign an appropriate weight to each intersection's edges in the city.  Weight is determined by both the number and type of crimes that have occurred in that location as well as the distance(for the sake of simplicity, every block, no matter how long, is assigned a distance of 1)
// Because geonames and googlemaps both throttle the number of API requests you can make per hour and per day, in order to get through all of the data, two geonames accounts had to be created and calls to crimeParser had to be spaced out over the course of a weekend.
//
// crimeData.data.length
//

async function crimeParser1(crimeData) {
  let count = 27500,
  crimeIncidentLat,
  crimeIncidentLng,
  latLngForAPIRequest,
  keyOption1,
  keyOption2,
  noMatches = 0,
  noMatchesArray = [],
  cnn;

  console.log(crimeData.data.length, " this is length of crimeData");

  for (let i = 27500; i < 30000; i++) {
    count++;
    console.log("this is our current count: ", count);

    const crimeIncident = crimeData.data[i];
    const incidentAddress = crimeIncident[16];

    if ((incidentAddress).indexOf('Block') > -1) {
      crimeIncidentLng = crimeIncident[17];
      crimeIncidentLat = crimeIncident[18];

      latLngForAPIRequest = formatLatLngForAPI(crimeIncidentLat, crimeIncidentLng)

      let intersectionFromBlockArray = await blockToIntersection1(latLngForAPIRequest);

      keyOption1 = intersectionFromBlockArray[0];
      keyOption2 = intersectionFromBlockArray[1];
    }

    if ((incidentAddress).indexOf('Block') === -1) {
      const splitIntersection = crimeIncident[16].split(' / ');
      // console.log(splitIntersection, " split intersection")
      let intersection1 = splitIntersection[0];
      let intersection2 = splitIntersection[1];

      if (((intersection2[0]).charCodeAt() > 47 && (intersection2[0]).charCodeAt() < 58) && ((intersection2[1]).charCodeAt() < 47 || (intersection2[1]).charCodeAt() > 58)) {
        intersection2 = `0${intersection2}`;
      }
      if (((intersection1[0]).charCodeAt() > 47 && (intersection1[0]).charCodeAt() < 58) && ((intersection1[1]).charCodeAt() < 47 || (intersection1[1]).charCodeAt() > 58)) {
        intersection1 = `0${intersection1}`;
      }
      let keyOption1 = `${intersection1},${intersection2}`;
      let keyOption2 = `${intersection2},${intersection1}`;
    }

      if (intersectionsObject[keyOption1]) {
        cnn = intersectionsObject[keyOption1];
      } else if (intersectionsObject[keyOption2]) {
        cnn = intersectionsObject[keyOption2];
      } else {
        noMatches++;
        noMatchesArray.push([keyOption1,keyOption2]);
        continue;
      }

      const graphNode = cnnObject[cnn];
      const crimeType = crimeIncident[9];
      addCrimeToEdges(graphNode, crimeType);
    }

    storeCnnObjectWithCrime(cnnObject);
    for(let j = 0; j < noMatchesArray.length; j++){
      let current = noMatchesArray[j];
      console.log("this is an intersection that has no match in the intersections object: ", current);
    }
    crimeParser2(crimeData);
  }

  async function crimeParser2(crimeData) {
    let count = 34521,
    crimeIncidentLat,
    crimeIncidentLng,
    latLngForAPIRequest,
    keyOption1,
    keyOption2,
    noMatches = 0,
    noMatchesArray = [],
    cnn;

    console.log(crimeData.data.length, " this is length of crimeData");

    for (let i = 34521; i < crimeData.data.length; i++) {
      count++;
      console.log("this is our current count: ", count);

      const crimeIncident = crimeData.data[i];
      const incidentAddress = crimeIncident[16];

      if ((incidentAddress).indexOf('Block') > -1) {
        crimeIncidentLng = crimeIncident[17];
        crimeIncidentLat = crimeIncident[18];

        latLngForAPIRequest = formatLatLngForAPI(crimeIncidentLat, crimeIncidentLng)

        let intersectionFromBlockArray = await blockToIntersection2(latLngForAPIRequest);

        keyOption1 = intersectionFromBlockArray[0];
        keyOption2 = intersectionFromBlockArray[1];
      }

      if ((incidentAddress).indexOf('Block') === -1) {
        const splitIntersection = crimeIncident[16].split(' / ');
        // console.log(splitIntersection, " split intersection")
        let intersection1 = splitIntersection[0];
        let intersection2 = splitIntersection[1];

        if (((intersection2[0]).charCodeAt() > 47 && (intersection2[0]).charCodeAt() < 58) && ((intersection2[1]).charCodeAt() < 47 || (intersection2[1]).charCodeAt() > 58)) {
          intersection2 = `0${intersection2}`;
        }
        if (((intersection1[0]).charCodeAt() > 47 && (intersection1[0]).charCodeAt() < 58) && ((intersection1[1]).charCodeAt() < 47 || (intersection1[1]).charCodeAt() > 58)) {
          intersection1 = `0${intersection1}`;
        }
        let keyOption1 = `${intersection1},${intersection2}`;
        let keyOption2 = `${intersection2},${intersection1}`;
      }

        if (intersectionsObject[keyOption1]) {
          cnn = intersectionsObject[keyOption1];
        } else if (intersectionsObject[keyOption2]) {
          cnn = intersectionsObject[keyOption2];
        } else {
          noMatches++;
          noMatchesArray.push([keyOption1,keyOption2]);
          continue;
        }

        const graphNode = cnnObject[cnn];
        const crimeType = crimeIncident[9];
        addCrimeToEdges(graphNode, crimeType);
      }

      storeCnnObjectWithCrime(cnnObject);
      for(let j = 0; j < noMatchesArray.length; j++){
        let current = noMatchesArray[j];
        console.log("this is an intersection that has no match in the intersections object: ", current);
      }
    }

    async function crimeParser3(crimeData) {
      let count = 22500 + 2500,
      crimeIncidentLat,
      crimeIncidentLng,
      latLngForAPIRequest,
      keyOption1,
      keyOption2,
      noMatches = 0,
      noMatchesArray = [],
      cnn;

      console.log(crimeData.data.length, " this is length of crimeData");

      for (let i = 22500 + 2500; i < 22500 + 2500 + 2500; i++) {
        count++;
        console.log("this is our current count: ", count);

        const crimeIncident = crimeData.data[i];
        const incidentAddress = crimeIncident[16];

        if ((incidentAddress).indexOf('Block') > -1) {
          crimeIncidentLng = crimeIncident[17];
          crimeIncidentLat = crimeIncident[18];

          latLngForAPIRequest = formatLatLngForAPI(crimeIncidentLat, crimeIncidentLng)

          let intersectionFromBlockArray = await blockToIntersection3(latLngForAPIRequest);

          keyOption1 = intersectionFromBlockArray[0];
          keyOption2 = intersectionFromBlockArray[1];
        }

        if ((incidentAddress).indexOf('Block') === -1) {
          const splitIntersection = crimeIncident[16].split(' / ');
          // console.log(splitIntersection, " split intersection")
          let intersection1 = splitIntersection[0];
          let intersection2 = splitIntersection[1];

          if (((intersection2[0]).charCodeAt() > 47 && (intersection2[0]).charCodeAt() < 58) && ((intersection2[1]).charCodeAt() < 47 || (intersection2[1]).charCodeAt() > 58)) {
            intersection2 = `0${intersection2}`;
          }
          if (((intersection1[0]).charCodeAt() > 47 && (intersection1[0]).charCodeAt() < 58) && ((intersection1[1]).charCodeAt() < 47 || (intersection1[1]).charCodeAt() > 58)) {
            intersection1 = `0${intersection1}`;
          }
          let keyOption1 = `${intersection1},${intersection2}`;
          let keyOption2 = `${intersection2},${intersection1}`;
        }

          if (intersectionsObject[keyOption1]) {
            cnn = intersectionsObject[keyOption1];
          } else if (intersectionsObject[keyOption2]) {
            cnn = intersectionsObject[keyOption2];
          } else {
            noMatches++;
            noMatchesArray.push([keyOption1,keyOption2]);
            continue;
          }

          const graphNode = cnnObject[cnn];
          const crimeType = crimeIncident[9];
          addCrimeToEdges(graphNode, crimeType);
        }

        storeCnnObjectWithCrime(cnnObject);
        for(let j = 0; j < noMatchesArray.length; j++){
          let current = noMatchesArray[j];
          console.log("this is an intersection that has no match in the intersections object: ", current);
        }
      }

function addCrimeToEdges(node, crime) {
  const crimeValue = crimeValues[crime];

  for (let i = 0; i < node.streetEdges.length; i++) {
    node.streetEdges[i].weight = node.streetEdges[i].weight + crimeValue;
    if (!(node.streetEdges[i].weight)) console.log(node, 'THIS IS THE NODE THAT IS NULL');
    if (node.streetEdges[i].crimeType[crime]) {
      node.streetEdges[i].crimeType[crime] += 1;
    } else {
      node.streetEdges[i].crimeType[crime] = 1;
    }
      console.log(node, 'node should have edges with crime data');
  }
}

function storeCnnObjectWithCrime(json) {
  const str = JSON.stringify(json);
    // console.log(str, ' this is the json str')
  fs.writeFile('./json/newCnnObject.json', str, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('cnnObjectWithCrimeSavedSuccessfully!');
  });
}

function blockToIntersection1(latLngforAPIRequest){
  let street1,
  street2,

  intersectionArray = new Promise(function(resolve,reject){
      rp(`http://api.geonames.org/findNearestIntersectionJSON?${latLngforAPIRequest}&username=safeway`)

        .then((response) => {
          console.log(response, "this is our response from GeoNames")

          parsedJSONResponse = JSON.parse(response);

          street1 = parsedJSONResponse.intersection.street1.toUpperCase()
          street2 = parsedJSONResponse.intersection.street2.toUpperCase()

          intersectionA = `${street1},${street2}`;
          intersectionB = `${street2},${street1}`;
          resolve([intersectionA, intersectionB])
        })

        .catch((error) => {
          console.log("This is our reverse geocoding error (where we input a lat,lng coordinate pair and output an intersectionArray) that results from our call to geonames API failing.  Here are the specific details: ", error);
          resolve(["",""]);
        })
    })

    return intersectionArray;
}

function blockToIntersection2(latLngforAPIRequest){
  let street1,
  street2,

  intersectionArray = new Promise(function(resolve,reject){
      rp(`http://api.geonames.org/findNearestIntersectionJSON?${latLngforAPIRequest}&username=safeway2`)

        .then((response) => {
          console.log(response, "this is our response from GeoNames")

          parsedJSONResponse = JSON.parse(response);

          street1 = parsedJSONResponse.intersection.street1.toUpperCase()
          street2 = parsedJSONResponse.intersection.street2.toUpperCase()

          intersectionA = `${street1},${street2}`;
          intersectionB = `${street2},${street1}`;
          resolve([intersectionA, intersectionB])
        })

        .catch((error) => {
          console.log("This is our reverse geocoding error (where we input a lat,lng coordinate pair and output an intersectionArray) that results from our call to geonames API failing.  Here are the specific details: ", error);
          resolve(["",""]);
        })
    })

    return intersectionArray;
}

function blockToIntersection3(latLngforAPIRequest){
  let street1,
  street2,

  intersectionArray = new Promise(function(resolve,reject){
      rp(`http://api.geonames.org/findNearestIntersectionJSON?${latLngforAPIRequest}&username=safeway3`)

        .then((response) => {
          console.log(response, "this is our response from GeoNames")

          parsedJSONResponse = JSON.parse(response);

          street1 = parsedJSONResponse.intersection.street1.toUpperCase()
          street2 = parsedJSONResponse.intersection.street2.toUpperCase()

          intersectionA = `${street1},${street2}`;
          intersectionB = `${street2},${street1}`;
          resolve([intersectionA, intersectionB])
        })

        .catch((error) => {
          console.log("This is our reverse geocoding error (where we input a lat,lng coordinate pair and output an intersectionArray) that results from our call to geonames API failing.  Here are the specific details: ", error);
          resolve(["",""]);
        })
    })

    return intersectionArray;
}
// function findLatLngOfBlock(incidentAddress){
//   let parsedJSONResponse,
//   lat,
//   lng,
//   latLngforAPIRequest,
//   street1,
//   street2,
//   intersectionA,
//   intersectionB,
//   intersectionArray;
//
//   return intersectionArray = new Promise((resolve, reject) => {
//     rp(`https://maps.googleapis.com/maps/api/geocode/json?address=${incidentAddress},+San+Francisco,+CA` + '&key=AIzaSyCx0LvEwPUgGhpLjCErr24dOnk-VWjo83g')
//
//       .then((response) => {
//         parsedJSONResponse = JSON.parse(response);
//         lat = parsedJSONResponse.results[0].geometry.location.lat
//         lng = parsedJSONResponse.results[0].geometry.location.lng
//         latLngforAPIRequest = "lat=" + lat.toString() + "&lng=" + lng.toString();
//
//         rp(`http://api.geonames.org/findNearestIntersectionJSON?${latLngforAPIRequest}&username=safeway`)
//
//           .then((response) => {
//             parsedJSONResponse = JSON.parse(response);
//             street1 = parsedJSONResponse.intersection.street1.toUpperCase();
//             street2 = parsedJSONResponse.intersection.street2.toUpperCase();
//
//             intersectionA = `${street1},${street2}`;
//             intersectionB = `${street2},${street1}`;
//           })
//           .catch((error) => {
//             console.log("This is our reverse geocoding error (where we input a lat,lng coordinate pair and output an intersectionArray) that results from our call to geonames API failing.  Here are the specific details: ", error);
//           })
//       })
//       .catch((error) => {
//         console.log("This is our geocoding error (where we input a specific city block and output a lat,lng coordinate pair) that results from our call to googlemaps API failing.  Here are the specific details: ", error);
//       })
//   })
// }

function formatLatLngForAPI(lat, lng){
  let latLngforAPIRequest = "lat=" + lat.toString() + "&lng=" + lng.toString();
  return latLngforAPIRequest;
}






/// new code above using request promise.
//     , (error, response, body) => {
//       if (!error && response.statusCode == 200) {
//         parsed = JSON.parse(body);
// 				console.log(parsed, "***THIS IS THE PARSED THING***");
// 				// console.log(parsed, 'this is the results')
//         if (parsed.status === 'ZERO_RESULTS') {
// 					// console.log('the ' + intersectionArray + ' does not exisits')
//           resolve('no address exsists');
//         } else {
// 					console.log('this intersection does exist ', parsed["results"][0]["geometry"]["location"])
//           resolve(parsed.results[0].geometry.location);
//         }
// 				// console.log(parsed["results"][0], " parsed ASDFASDFASDF", intersectionArray, "Intersection Array")
//       } else {
//         reject(error);
//       }
//     });
//   }).then(addressLatLng => new Promise((resolve, reject) => {
//     let lat = addressLatLng.lat;
//     let lng = addressLatLng.lng;
//     let latLngforAPIRequest = "lat=" + lat.toString() + "&lng=" + lng.toString();
//     console.log(latLngforAPIRequest)
//
//     request(`http://api.geonames.org/findNearestIntersectionJSON?${latLngforAPIRequest}&username=safeway`, (error, response, body) => {
//
//       if (!error && response.statusCode == 200) {
//         parsed = JSON.parse(body);
//
//         street1 = parsed.intersection.street1.toUpperCase();
//         street2 = parsed.intersection.street2.toUpperCase();
//
//         intersectionA = `${street1},${street2}`;
//         intersectionB = `${street2},${street1}`;
//
//         resolve([intersectionA, intersectionB]);
// 				// console.log(parsed, 'this is the results')
//         if (parsed.status === 'ZERO_RESULTS') {
// 					// console.log('the ' + intersectionArray + ' does not exisits')
//           resolve('no address exsists');
//         } else {
//
//         }
// 				// console.log(parsed["results"][0], " parsed ASDFASDFASDF", intersectionArray, "Intersection Array")
//       } else {
//         reject(error);
//       }
//     })
//   }))
// }
//
//
//
// function findClosestIntersectionToLatLng(string){
//   return closestIntersection = new Promise((resolve, reject) => {
//     request(`http://api.geonames.org/findNearestIntersection?lat=${string}&username=demo`), (error, response, body) => {
//       if (!error && response.statusCode == 200) {
//         parsed = JSON.parse(body);
// 				console.log(parsed, "***THIS IS THE PARSED THING***");
// 				// console.log(parsed, 'this is the results')
//         if (parsed.status === 'ZERO_RESULTS') {
// 					// console.log('the ' + intersectionArray + ' does not exisits')
//           resolve('no address exsists');
//         } else {
// 					console.log('this intersection does exist ', parsed["results"][0]["geometry"]["location"])
//           resolve(parsed.results[0].geometry.location);
//         }
// 				// console.log(parsed["results"][0], " parsed ASDFASDFASDF", intersectionArray, "Intersection Array")
//       } else {
//         reject(error);
//       }
//     }
//   })
// };

// findLatLngOfBlock("200 Block of BRYANT ST");

  //
  // let lat = parsed["results"][0]["geometry"]["location"]["lat"];
  // let lng = parsed["results"][0]["geometry"]["location"]["lng"]
  //
  // console.log("this is lat ", lat, " and this is lng ", lng)


  // ${}
  //
  // return closestIntersection = new Promise((resolve, reject) => {
  //   request(`https://maps.googleapis.com/maps/api/geocode/json?address=${incidentAddress},+San+Francisco,+CA` + '&key=AIzaSyCx0LvEwPUgGhpLjCErr24dOnk-VWjo83g', (error, response, body) => {



// function showCrimeTypes(){
//   for(var i = 0; i < crimeData.data.length; i++){
//     var crimeIncident = crimeData.data[i];
//     var crimeType = crimeIncident[9];
//     if(crimeTypes.indexOf(crimeType) === -1){
//       crimeTypes.push(crimeType);
//     }
//   }
//   return console.log(crimeTypes, "THESE ARE THE TYPES OF CRIMES IN OUR DATASET");
// }
//
// showCrimeTypes();


// console.log(crimeData.data[0][16])


// "01ST ST,STEVENSON ST"
