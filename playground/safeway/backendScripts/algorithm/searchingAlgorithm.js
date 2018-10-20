const cnnObject =  require('./json/newCnnObject.json'),
  intersectionsObject = require('./json/intersectionsObject.json'),
  latLngObject = require('../../cache/latLngObject'),
  getLatLng = require('./getLatLng.js').convertIntersectionLatLng,
  PriorityQueue = require('./priorityQueue.js').PriorityQueue;


//= =======================GRAB USER INPUT AND GETS CNN=======================================================
async function userInput(origin, destination){
  //function userInput takes origin and destination intersections as string datatype, for example "1st st".  It formats those intersections to match the format found in DataSF Open Data (https://datasf.org/opendata/) and then returns a call to our A* search algorithm using the formatted string values.
    let originCNN,
      destinationCNN,
      originNode,
      destinationNode;

  let formattedInputArray = formatInputs(origin, destination);
  //change string format from "1st st, fell st" to "1ST ST,FELL ST" which is the format our data from DATASF is found.
  origin = formattedInputArray[0];
  origin2 = origin.slice().split(",").reverse().join(",");
  destination = formattedInputArray[1];
  destination2 = destination.slice().split(",").reverse().join(",");

  // console.log("this is origin: ", origin, " and this is destination: ", destination);

  //The following control flow statements check for our origin and destination in our "intersectionsObject", which is a cache containing intersections in san francisco and their corresponding identification number(which we call CNN).  We use this CNN with our CNN object in order to find both the "originNode" containing our origin intersection and "destinationNode" containing our destination intersection.

  if(intersectionsObject[origin] !== undefined || intersectionsObject[origin2] !== undefined){
    // console.log("intersectionsObj[origin] is defined")
    originCNN = intersectionsObject[origin] || intersectionsObject[origin2];
    originNode = cnnObject[originCNN];
  }
  // else {
  //
  //   const intersection1 = origin.split(',')[0],
  //     intersection2 = origin.split(',')[1],
  //     intersection = `${intersection2},${intersection1}`;
  //
  //   originCNN =  intersectionsObject[intersection];
  //   originNode = cnnObject[originCNN],
  //
  // }

  if(intersectionsObject[destination] !== undefined || intersectionsObject[destination2] !== undefined){
    // console.log("intersectionsObj[destination] is defined")
    destinationCNN = intersectionsObject[destination] || intersectionsObject[destination2];
    destinationNode = cnnObject[destinationCNN];
  }
  // else {
  //
  //   const intersection1 = destination.split(',')[0],
  //     intersection2 = destination.split(',')[1],
  //     intersection = `${intersection2},${intersection1}`;
  //
  //   destinationCNN =  intersectionsObject[intersection];
  // }


  //Now that we have our originNode and destinationNode, we do two things:
  //1. Find the GPS latitutde longitude location of our destination with which we will compute our heuristic to be used in the A* algorithm.
  //2. Call our A* algorithm.
  //
  const data = await getLatLng(destinationNode.intersection1)
		.then((destinationLatLng) => {

  return aStarSearch(originNode, destinationNode, destinationLatLng, destinationCNN);
})
		.catch((err) => {
  console.log(`this is the error from trying to get the destinationLatLng ${err}`);

});
  return data;
}
//working
// userInput(('BUSH ST,OCTAVIA ST'),('SUTTER ST,WEBSTER ST'));
//2279
// userInput(('CAPRA WAY,SCOTT ST'), ("FRANCISCO ST,BAKER ST"));
//19
// userInput(('GROVE ST,BAKER ST'),('HAIGHT ST,DIVISADERO ST'));
// userInput(('greenwich ST,steiner ST'),('post ST,lyon ST'));
//36
// userInput(('VALLEJO ST,LEAVENWORTH ST'),('HYDE ST,LOMBARD ST'));
//NANNY
// userInput(('FILBERT ST,BUCHANAN ST'),("FRANCISCO ST,BAKER ST"));
// 427
// userInput(('PINE ST,FILLMORE ST'),('WASHINGTON ST,FRANKLIN ST'));
//940
// userInput(('BRODERICK ST,OAK ST'),('haight st, divisadero st'));
// 9
// userInput(('PINE ST,FILLMORE ST'),('FRANCISCO ST,BAKER ST'));
//606
// userInput(('24th ST, Folsom St'),('19th ST, Kansas St'));
//// 1390
// userInput(('BUSH ST,OCTAVIA ST'),('CAPRA WAY,SCOTT ST'));
//2143
//userInput(('CLAYTON ST,FREDERICK ST'),('HAIGHT ST,Divisadero ST'));
// 132
// userInput(("28th st and noe st"),("polk st and lombard st"));
// 4695
// userInput(('webster st and waller st'),('fillmore st and broadway st'))
// 3044

//not working
// userInput(('FRANCISCO ST,LARKIN ST'),('WEBSTER ST,BEACH ST'));
// userInput(('Vallejo St, Steiner St'),('Church St, 15TH ST'));
// userInput(('18th ST, NOE ST'),('17th ST,TEXAS ST'));

// userInput(("polk st and lombard st"),("moraga st and 42nd ave"));
// userInput(("28th st and noe st"),("moraga st and 42nd ave));
// userInput(("24th st and GUERRERO st"),("vallejo st & leavenworth st"));
// userInput(("divisadero st and JEFFERSON st"),("polk st and vallejo st"));




//= =======================A STAR SEARCH=======================================================
async function aStarSearch(sourceNode, destinationNode, destinationLatLng, destinationCNN) {
  const frontier = new PriorityQueue(),
    explored = new Set(),
    queueObj = {
      node: sourceNode,
      cost: 0,
      path: []
    };

  frontier.enqueue(queueObj, queueObj.cost);

  let count = 0;

	// Search until we're out of nodes.  We won't be out of nodes until we either find the node
  // that we are looking for OR every single node in the graph has been checked.
  while (frontier.length > 0) {
    console.log(frontier, " frontier");

    count++;

    const currentQueueObj = frontier.dequeue(),
      curNode = currentQueueObj.obj.node,
      curPath = currentQueueObj.obj.path,
      curCost = currentQueueObj.obj.cost,
      curCnn = currentQueueObj.obj.node.cnn;

    // console.log("this is the cost of the current queueObj: ", curCost, " ", curNode);

    if (explored.has(curNode)) {
      // console.log(curNode.cnn, ' this has already been explored');
      continue;
    }

		// Found a solution, return the path.
    if (curCnn === destinationCNN) {
      curPath.push(curNode);
      let output = formatOutputToText(curPath);
        console.log(output, " this is output to be fed to google maps");
        console.log("this is curpath", curPath);
        console.log("this is count ", count)

      return output;
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
        var heuristicValue = await computeHeuristic(newNode, destinationLatLng, curNode);

        if(isNaN(heuristicValue)) {
          // console.log(newNode, " this is newNode being nanny AF");
          // console.log("and this is count: ", count);
          continue;
        }
      } catch (err) {
        console.log(err, 'this is the err in the try catch block');
        return;
      }

      if (heuristicValue === 'no address exists') {
        explored.add(newNode);
      } else {
        const newQueueObj = {
          node: newNode,
          path: newPath,
          cost: newEdgeWeight + curCost, // NOTE: No heuristic here -- thats correct
        };
        // console.log("Is this cost NaN? ", newQueueObj.cost + heuristicValue)

        frontier.enqueue(newQueueObj, newQueueObj.cost + heuristicValue);
      }
    }
		// console.log(curNode.cnn)
    explored.add(curNode);
  }
  // console.log('Frontier.length === 0... we have run out of nodes to search.');
  console.log('this is count', count);
  return 'Frontier.length === 0... we have run out of nodes to search.';
}

//= =======================COMPUTES THE HEURISTIC=======================================================
function computeHeuristic(newNode, finalLatLong, curNode) {
  const cnn = newNode.cnn;

  let distance;

  let newNodeIntersection = newNode.intersection1;

  if (newNodeIntersection.indexOf('  \\ ') !== -1) {
    newNodeIntersection = fixSlashes(newNodeIntersection);
  }

  //Most of our intersections' coordinate pair locations will be contained within the latLngObject which is a CNN:coordinate pair cache.  If there is a match with the curNode's CNN in the latLngObject, we make a call to the latLngDistance function using this match.  The latLngDistance function returns the distance from the current intersection in question's location as a coordinate pair and the destination's location as a coordinate pair.  We use the distance returned from this function as our heuristic.
  if (latLngObject[cnn]) {
    let newNodeLatLong = latLngObject[cnn];
    if(newNodeLatLong === "no address exsists"){
      newNodeLatLong = latLngObject[curNode.cnn];
      console.log("no address exists so we are fudging our distance a little bit by assigning the lat long of it's neighboring intersection")
      if(!newNodeLatLong){
        return 1;
      }
    }
    // console.log(newNodeLatLong, " this is newNodelatlng, ", finalLatLong, " and this is finalLatlng");
    distance = latLngDistance(newNodeLatLong, finalLatLong);
    // console.log("this is our distance coming from heuristic equation, ", distance)
    return distance * 1.5;
  }

  // console.log("this is the curr node intersection: ", newNodeIntersection)

  return getLatLng(newNodeIntersection)
		.then((response) => {
  if (response === 'no address exists') {
    return 'no address exists';
  }

  const newNodeLatLong = response;
  // console.log(response, " mahfucka response");
  // console.log(newNodeLatLong, " this is newNodelatlng, ", finalLatLong, " and this is finalLatlng");

  distance = latLngDistance(newNodeLatLong, finalLatLong);
  // console.log("this is our distance coming from heuristic equation, ", distance)
  return distance * 1,5;
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
// resolve('no address exists') } else { // console.log('this intersction does exsisit ',
// parsed["results"][0]["geometry"]["location"]) resolve(parsed["results"][0]["geometry"]["location"]); } //
// console.log(parsed["results"][0], " parsed ASDFASDFASDF", intersectionArray, "Intersection Array") } else {
// reject(err) } }); }); // console.log(p, " this is P"); // return p; }

//= =======================GETS DISTANCE BETWEEN TWO LAT LONG POINTS===================================================
function latLngDistance(latLngObj1, latLngObj2, unit = 'K') {
console.log("we here");
let lat1 = latLngObj1.lat,
  lat2 = latLngObj2.lat,
  lng1 =latLngObj1.lng,
  lng2 = latLngObj2.lng;
// console.log(lat1, "this is lat1 ", lat2, " and this is lat2");
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lng1 - lng2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit === 'K') { dist *= 1.609344; }
  if (unit === 'N') { dist *= 0.8684; }
  // console.log("this is our distance coming from latlngdistance, ", dist);
  return dist;
}


//========================REMOVES SLASHES FROM INTERSECTION======================================================

function fixSlashes(arr) {
  if (arr[0].indexOf(' \\ ') !== -1) {
    const newStreet = arr[0].split(' \\')[0];
    return `${newStreet},${arr[1]}`;
  }
  const newStreet2 = arr[1].split(' \\')[0];
  return `${arr[0]},${newStreet2}`;
}
/* =====================Format User Input to something the algorithm can work with ================================ */

function formatInputs(origin, destination){
	let formattedOrigin,
		formattedDestination;

	if(origin.indexOf("and") > -1){
		formattedOrigin = origin.split("and");
	}
	if(origin.indexOf("&") > -1){
		formattedOrigin = origin.split("&");
	}

  if(origin.indexOf(",") > -1){
    formattedOrigin = origin.split(',');
  }

	if(destination.indexOf("and") > -1){
		formattedDestination = destination.split("and");
	}
	if(destination.indexOf("&") > -1){
		formattedDestination = destination.split("&");
	}
  if(destination.indexOf(",") > -1){
    formattedDestination = destination.split(',');
  }

	return [ formattedOrigin.map((str) => str.trim().toUpperCase()).join(","), formattedDestination.map((str) => str.trim().toUpperCase()).join(",") ];
};

function formatOutputToText(output){
	let outputArray = ["Start by walking to the intersection of " + makeProper(output[0].intersection1[0]) + " and " + makeProper(output[0].intersection1[1])+ "."],

		currentStreet = findCS(output[0].intersection1, output[1].intersection1),
    properCurrentStreet = makeProper(currentStreet),

		towardsStreet,
    properTowardsStreet,

		numberOfBlocks = 0,
    firstDirectionGiven = false,
    waypointArray = [],
    allIntersectionArray=[];


	for(let i = 1; i < output.length; i++){

		let currentIntersection = output[i].intersection1,
		  previousIntersection = output[i-1].intersection1;

      allIntersectionArray.push(currentIntersection);


		if(currentStreet === currentIntersection[0] || currentStreet === currentIntersection[1] || currentIntersection[0].indexOf(currentStreet) > -1 || currentIntersection[1].indexOf(currentStreet) > -1){
			numberOfBlocks++;

		} else {

      waypointArray.push(previousIntersection);

      if(!firstDirectionGiven){
        towardsStreet = findTS(previousIntersection, currentStreet);
        properTowardsStreet = makeProper(towardsStreet);

        outputArray.push("Travel on " + properCurrentStreet + " for " + numberOfBlocks + " block(s) towards " + properTowardsStreet + ".");
      }

      // let nextIntersection = output[i+1].intersection1
      if(firstDirectionGiven){
        outputArray.push("Travel on " + properCurrentStreet + " for " + numberOfBlocks + " block(s).")
      }

      firstDirectionGiven = true;

      currentStreet = findCS(currentIntersection, previousIntersection);
			towardsStreet = findTS(currentIntersection, currentStreet);

      properCurrentStreet = makeProper(currentStreet);
      properTowardsStreet = makeProper(towardsStreet);

      outputArray.push("Turn on " + properCurrentStreet + " towards " + properTowardsStreet + ".");

      numberOfBlocks = 1;

      if(i+1 === output.length) outputArray.push("Travel on " + properCurrentStreet + " for " + numberOfBlocks + " block.");
		}
	}
  if(numberOfBlocks > 1){
    outputArray.push("Travel on " + properCurrentStreet + " for " + numberOfBlocks + " block(s).")
  }
  outputArray.push("You have arrived at your destination: " + makeProper(output[output.length - 1].intersection1[0]) + " at " + makeProper(output[output.length - 1].intersection1[1])+ ".");

  let outputObject = {outputArray, waypointArray, allIntersectionArray};
	// return formatOutputToWaypoints(outputObject.waypointArray);
	return formatOutputToWaypoints(outputObject.waypointArray);
};

function makeProper(street){
    return street.split(" ").map((word) => {return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()}).join(" ");
};

function findCS(intersection1, intersection2){
	if(intersection1[0] === intersection2[0] || intersection2[0].indexOf(intersection1[0]) > -1) return intersection1[0];
	if(intersection1[0] === intersection2[1] || intersection2[1].indexOf(intersection1[0]) > -1) return intersection1[0];
	if(intersection1[1] === intersection2[0] ||intersection2[0].indexOf(intersection1[1])) return intersection1[1];
	if(intersection1[1] === intersection2[1] || intersection2[1].indexOf(intersection1[1]) > -1) return intersection1[1];
};

function findTS(intersection, currentStreet){
	if(intersection[0] === currentStreet){
    return intersection[1];
  } else {
    return intersection[0];
  };
};

function formatOutputToWaypoints(output){
  return output.map(function(arr){
    return {location: arr[0].concat( " & ").concat(arr[1]), stopover:false}
  });
}

module.exports = {userInput};
