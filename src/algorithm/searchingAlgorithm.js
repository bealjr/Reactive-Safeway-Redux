import cnnObject from '../cache/cnnObjectWithCrimeAndCorrectEdges.json';
import intersectionsObject from '../cache/intersectionsObject.json';
import latLngObject from '../cache/latLngObject';
import getLatLng from './getLatLng.js';
import PriorityQueue from './priorityQueue.js';

//= =======================GRAB USER INPUT AND GETS CNN=======================================================
export default async function userInput(origin, destination) {

  if (origin.indexOf('  \\ ') !== -1) {
    origin = fixSlashes(origin);
  }
  if (destination.indexOf('  \\ ') !== -1) {
    destination = fixSlashes(destination);
  }
  origin = origin.split(', ').join(',').toUpperCase();
  destination = destination.split(', ').join(',').toUpperCase();

  console.log(origin, destination, "this is our origin and destination.")
  let originCNN;
  let destinationCNN

  if(intersectionsObject[origin] !== undefined){
    console.log("WE MADE IT HERE")
    originCNN = intersectionsObject[origin];

  }else{

    const intersection1 = origin.split(',')[0]
    const intersection2 = origin.split(',')[1]
    const intersection = `${intersection2},${intersection1}`
    console.log(intersection, " THIS IS THE INTERSECTION")
    originCNN =  intersectionsObject[intersection]
  }

  if(intersectionsObject[destination] !== undefined){
    console.log("WE MADE IT HERE")
    destinationCNN = intersectionsObject[destination];
  }else{
    const intersection1 = destination.split(',')[0]
    const intersection2 = destination.split(',')[1]
    const intersection = `${intersection2},${intersection1}`
    console.log(intersection, " THIS IS THE INTERSECTION")
    destinationCNN =  intersectionsObject[intersection]
  }


  console.log(originCNN, " this is origin CNN")

  const originNode = cnnObject[originCNN];
  const destinationNode = cnnObject[destinationCNN];
	// console.log(destinationNode, "THIS IS THE DESTINATION NODE")
  const data = await getLatLng(destinationNode.intersection1)
		.then((response) => {
  const destinationLatLng = response;
          console.log(destinationLatLng, "THIS IS destination LAT LNG")
  return dijkstraSearch(originNode, destinationNode, destinationLatLng, destinationCNN);
})
		.catch((err) => {
  console.log(`this is the error from trying to get the destinationLatLng ${err}`);

});
  console.log(data, " Here's your data")
  return data;
}

// userInput(('CAPRA WAY,SCOTT ST'), ("FRANCISCO ST,BAKER ST"));


//= =======================A STAR SEARCH=======================================================
async function dijkstraSearch(sourceNode, destinationNode, destinationLatLng, destinationCNN) {
  const frontier = new PriorityQueue(); // We're assuming such a class exists.
  const explored = new Set();
  const queueObj = {
    node: sourceNode,
    cost: 0,
    path: [],
  };
  frontier.enqueue(queueObj, queueObj.cost);
	// Search until we're out of nodes
  while (frontier.length > 0) {
    const currentQueueObj = frontier.dequeue();
    
    const curNode = currentQueueObj.objeeee.node;
    const curPath = currentQueueObj.objeeee.path;
    const curCost = currentQueueObj.objeeee.cost;
		// console.log(curNode['cnn'], 'is this the erro? ')
    const curCnn = curNode.cnn;

		// Found a solution, return the path.
    if (curCnn === destinationCNN) {
      console.log(curPath, ' we made it!!!!!');

      return curPath;
    }
    if (explored.has(curNode)) {
      console.log(curNode.cnn, ' this has already been explored');
      continue;
    }

    for (let i = 0; i < curNode.streetEdges.length; i++) {
      const curNodeEdges = curNode.streetEdges[i];
      let newNodeCNN;
      if (curNodeEdges.first !== curCnn) {
        newNodeCNN = curNodeEdges.first;
      } else {
        newNodeCNN = curNodeEdges.second;
      }
      const newEdgeWeight = curNode.streetEdges[i].weight;
      const newNode = cnnObject[newNodeCNN];
      const newPath = curPath.slice();
      newPath.push(curNode);
      try {
        var heuristicValue = await computeHeuristic(newNode, destinationLatLng);
      } catch (err) {
        console.log(err, 'this is the err in the try catch block');
        return;
      }

      if (heuristicValue === 'no address exsists') {
        explored.add(newNode);
      } else {
        const newQueueObj = {
          node: newNode,
          path: newPath,
          cost: newEdgeWeight + curCost, // NOTE: No heuristic here -- thats correct
        };
        frontier.enqueue(newQueueObj, newQueueObj.cost + heuristicValue);
      }
    }
		// console.log(curNode.cnn)
    explored.add(curNode);
  }
  console.log('not working, fix it');
  return 'not working, fix it';
}

//= =======================COMPUTES THE HEURISTIC=======================================================
function computeHeuristic(currNode, finalLatLong) {
  const cnn = currNode.cnn;
  let currNodeIntersection = currNode.intersection1;
  if (currNodeIntersection.indexOf('  \\ ') !== -1) {
    currNodeIntersection = fixSlashes(currNodeIntersection);
  }
  if (latLngObject[cnn]) {
    return latLngObject[cnn];
  }
  return getLatLng(currNodeIntersection)
		.then((response) => {
  if (response === 'no address exsists') {
    return 'no address exsists';
  }
  const currNodeLatLong = response;
  const distance = latLngDistance(currNodeLatLong, finalLatLong);
  return distance;
})
		.catch((err) => {
  console.log(err, ' this is the error in computeHeuristic');
  return err;
});
}


// //========================CONVERT INTERSECTION TO LAT LONG=======================================================
// function convertIntersectionLatLng(intersectionArray){
// 	var firstStreet;
// 	var secondStreet;
// 	// ["JAMESTOWN AVE","GILROY ST"],
// 	if(intersectionArray[0].indexOf(" \\ ") !== -1 || intersectionArray[1].indexOf(" \\ ") !== -1 ){
// 		var currNodeIntersection = fixSlashes(intersectionArray)
// 		//KIRKWOOD AVE,DORMITORY RD
// 		var newArr = currNodeIntersection.split(',')
// 		firstStreet = newArr[0].split(" ").join("+");
// 		secondStreet = newArr[1].split(" ").join("+");
// 	} else {
// 		firstStreet = intersectionArray[0].split(" ").join("+");
// 		secondStreet = intersectionArray[1].split(" ").join("+");
// 	}
// 	let p;
// 	// console.log("IDX " + slashIdx)
// 	// console.log("2nd " + secondStreet)
// 	return p = new Promise(function(resolve, reject){
// 		request("https://maps.googleapis.com/maps/api/geocode/json?address=" + firstStreet + "+and+" + secondStreet +
// ",+San+Francisco,+CA" + "&key=AIzaSyC9FPqo6Pdx4VjALRx5oeEDhfQvb-fkDjE", function (error, response, body) { if
// (!error && response.statusCode == 200) { var parsed = JSON.parse(body); // console.log(parsed, 'this is the
// results') if(parsed["status"] === 'ZERO_RESULTS'){ // console.log('the ' + intersectionArray + ' does not exisits')
// resolve('no address exsists') } else { // console.log('this intersction does exsisit ',
// parsed["results"][0]["geometry"]["location"]) resolve(parsed["results"][0]["geometry"]["location"]); } //
// console.log(parsed["results"][0], " parsed ASDFASDFASDF", intersectionArray, "Intersection Array") } else {
// reject(err) } }); }); // console.log(p, " this is P"); // return p; }

//= =======================GETS DISTANCE BETWEEN TWO LAT LONG POINTS===================================================
function latLngDistance({ lat1, lon1 }, { lat2, lon2 }, unit = 'K') {
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit === 'K') { dist *= 1.609344; }
  if (unit === 'N') { dist *= 0.8684; }
  return dist;
}


//= =======================REMOVES SLASHES FROM INTERSECTION======================================================
export function fixSlashes(arr) {
  if (arr[0].indexOf(' \\ ') !== -1) {
    const newStreet = arr[0].split(' \\')[0];
    return `${newStreet},${arr[1]}`;
  }
  const newStreet2 = arr[1].split(' \\')[0];
  return `${arr[0]},${newStreet2}`;
}
