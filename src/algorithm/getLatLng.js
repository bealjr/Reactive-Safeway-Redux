const intersectionsObject = require('./json/intersectionsObject.json');
const request = require('request');
const fs = require('fs');
const apiPreCheckObject = require('../cache/apiPreCheckObject.json');
const cnnLatLngObj = require('../cache/latLngObject.json');
// var fixSlashes = require("./searchingAlgorithm.js")
// import {fixSlashes} from ("./searchingAlgorithm.js");

// "18TH ST,CHURCH ST"

async function createCNNLatLngObject(json) {
  let cnn;
  let formatedIntersection;
  let counter = 0;
  let latLngObj;
  for (const intersection in json) {
    cnn = json[intersection];
		// console.log(cnn, 'this is the cnn')
    formatedIntersection = intersection.split(',');
    if (!apiPreCheckObject[cnn]) {
      apiPreCheckObject[cnn] = true;
      try {
        latLngObj = await convertIntersectionLatLng(formatedIntersection);
      }			catch (err) {
				// console.log(err, " this is the error in the try catch block")
        return;
      }
      cnnLatLngObj[cnn] = latLngObj;
      counter++;
      if (counter > 2) {
        storeLatLngObject(cnnLatLngObj);
        storeApiPreCheckObject(apiPreCheckObject);
        return cnnLatLngObj;
      }
    }
  }
}

// createCNNLatLngObject(intersectionsObject);

// console.log(Object.keys(intersectionsObject).length, "length");
// createCNNLatLngObject(intersectionsObject);


function storeLatLngObject(obj) {
  const str = JSON.stringify(obj);
    // console.log(str, ' this is the json str')
  fs.writeFile('./json/latLngObject.json', str, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('The LatLng Object was saved!');
  });
}

function storeApiPreCheckObject(obj) {
  const str = JSON.stringify(obj);
    // console.log(str, ' this is the json str')
  fs.writeFile('./json/apiPreCheckObject.json', str, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('The apiPreCheck Object was saved!');
  });
}


function convertIntersectionLatLng(intersectionArray) {
    console.log("CONVERTING INTERSECTION")
  let firstStreet;
  let secondStreet;
	// ["JAMESTOWN AVE","GILROY ST"],
  if (intersectionArray[0].indexOf(' \\ ') !== -1 || intersectionArray[1].indexOf(' \\ ') !== -1) {
    const currNodeIntersection = fixSlashes(intersectionArray);
		// KIRKWOOD AVE,DORMITORY RD
    const newArr = currNodeIntersection.split(',');
    firstStreet = newArr[0].split(' ').join('+');
    secondStreet = newArr[1].split(' ').join('+');
  } else {
    firstStreet = intersectionArray[0].split(' ').join('+');
    secondStreet = intersectionArray[1].split(' ').join('+');
  }
  let p;
	// console.log(firstStreet, " THIS IS 1st street", secondStreet, " THIS IS 2nd street")
	// console.log("IDX " + slashIdx)
	// console.log("2nd " + secondStreet)
  return p = new Promise((resolve, reject) => {
    request(`https://maps.googleapis.com/maps/api/geocode/json?address=${firstStreet}+and+${secondStreet},+San+Francisco,+CA` + '&key=AIzaSyCx0LvEwPUgGhpLjCErr24dOnk-VWjo83g', (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const parsed = JSON.parse(body);
				console.log(parsed, "***THIS IS THE PARSED THING***");
				// console.log(parsed, 'this is the results')
        if (parsed.status === 'ZERO_RESULTS') {
					// console.log('the ' + intersectionArray + ' does not exisits')
          resolve('no address exsists');
        } else {
					console.log('this intersction does exsisit ', parsed["results"][0]["geometry"]["location"])
          resolve(parsed.results[0].geometry.location);
        }
				// console.log(parsed["results"][0], " parsed ASDFASDFASDF", intersectionArray, "Intersection Array")
      } else {
        reject(error);
      }
    });
  });
	// console.log(p, " this is P");
	// return p;
}

function fixSlashes(arr) {
	// "03RD ST,KEARNY ST \\ MARKET ST"
	// console.log(arr, 'this is the arr')

  if (arr[0].indexOf(' \\ ') !== -1) {
		// console.log('herehe now', arr[0])
    const newStreet = arr[0].split(' \\')[0];
		// console.log(newStreet, 'hereeeeer newstreet1')
    return `${newStreet},${arr[1]}`;
  }
  const newStreet2 = arr[1].split(' \\')[0];
		// console.log(newStreet2, 'hereeeer newstreet2')
  return `${arr[0]},${newStreet2}`;
}

module.exports = {
    createCNNLatLngObject, convertIntersectionLatLng
}
