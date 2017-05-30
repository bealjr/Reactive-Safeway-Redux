const crimeData = require('../cache/cleanCrimeData.json');
// var streetGraph = require("./streetNode.js");
const fs = require('fs');
const intersectionsObject = require('../cache/intersectionsObject.json');
const cnnObject = require('../cache/cnnObject.json');
const graph = require('./graph.js');

const incidents = {};
const crimeTypes = [];
const crimeValues = {
  ASSAULT: 4,
  'MISSING PERSON': 4,
  ROBBERY: 4,
  ARSON: 1,
  'VEHICLE THEFT': 2,
  'LARCENY/THEFT': 3,
  WARRANTS: 1,
  RUNAWAY: 0,
  BURGLARY: 1,
  TRESPASS: 1,
  VANDALISM: 1,
  'DRUG/NARCOTIC': 2,
  'STOLEN PROPERTY': 1,
  FRAUD: 0,
  KIDNAPPING: 5,
  DRUNKENNESS: 1,
  'DRIVING UNDER THE INFLUENCE': 1,
  'SEX OFFENSES, FORCIBLE': 5,
  'FORGERY/COUNTERFEITING': 0,
  PROSTITUTION: 1,
  'SECONDARY CODES': 1,
  'WEAPON LAWS': 3,
  'DISORDERLY CONDUCT': 1,
  SUICIDE: 0,
  'FAMILY OFFENSES': 1,
  'RECOVERED VEHICLE': 0,
  EXTORTION: 0,
  'LIQUOR LAWS': 0,
  LOITERING: 0,
  EMBEZZLEMENT: 0,
  GAMBLING: 0,
  BRIBERY: 0,
  'SEX OFFENSES, NON FORCIBLE': 1,
  'PORNOGRAPHY/OBSCENE MAT': 1,
  'BAD CHECKS': 0,
  TREA: 0,
};
// var intersectionsObject = JSON.parse(intersectionsObjectJSON);
// var cnnObject = JSON.parse(cnnObjectJSON);

function crimeParser(crimeData) {
  for (let i = 0; i < crimeData.data.length; i++) {
    const crimeIncident = crimeData.data[i];
    // console.log(crimeData.data[i])
    // console.log(crimeIncident, " crime incident")
    const incidentAddress = crimeIncident[16];
    // console.log(incidentAddress, " incident address")

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
      const keyOption1 = `${intersection1},${intersection2}`;
      const keyOption2 = `${intersection2},${intersection1}`;
      var cnn;

      if (intersectionsObject[keyOption1]) {
        cnn = intersectionsObject[keyOption1];
      } else if (intersectionsObject[keyOption2]) {
        cnn = intersectionsObject[keyOption2];
      }
      const graphNode = cnnObject[cnn];
      const crimeType = crimeIncident[9];
      addCrimeToEdges(graphNode, crimeType);
    //   console.log(keyOption1, " kopt1", keyOption2, " kopt2", cnn, " cnn", graphNode, " graphNode", crimeIncident[9], 'crimeIncident');
    }


    // var crimeType = crimeIncident[9];
    // console.log(incidentAddress, "address", " INTERSECTION1", intersection2, " INTERSECTION2");
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
        // console.log(node, 'node should have edges with crime data');
  }
}
crimeParser(crimeData);

storeCnnObjectWithCrime(cnnObject);

function storeCnnObjectWithCrime(json) {
  const str = JSON.stringify(json);
    // console.log(str, ' this is the json str')
  fs.writeFile('./json/cnnObjectWithCrime.json', str, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
}

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

// showCrimeTypes();


// console.log(crimeData.data[0][16])


// "01ST ST,STEVENSON ST"
