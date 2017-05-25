'use strict'
import cnnObject  from "../cache/cnnObjectWithCrimeAndCorrectEdges.json";
import graph  from "./graph.js";
import intersectionsObject  from "../cache/intersectionsObject.json";
import PriorityQueue  from "./priorityQueue.js";
import request  from "request";
import getLatLng  from "./getLatLng.js";
import latLngObject  from "../cache/latLngObject";

//========================GRAB USER INPUT AND GETS CNN=======================================================
export default function userInput (origin, destination){
	if(origin.indexOf("  \\ ") !== -1){
		origin = fixSlashes(origin)
	}
	if(destination.indexOf("  \\ ") !== -1){
		destination = fixSlashes(destination)
	}
	var originCNN = intersectionsObject[origin];
	var destinationCNN = intersectionsObject[destination];
	console.log(originCNN, 'hdkshfjdhfjsdhfj', destinationCNN)
	var originNode = cnnObject[originCNN];
	var destinationNode = cnnObject[destinationCNN];
	// console.log(destinationNode, "THIS IS THE DESTINATION NODE")
	getLatLng(destinationNode["intersection1"])
	.then(function(response){
		var destinationLatLng = response;
		dijkstraSearch(originNode, destinationNode, destinationLatLng, destinationCNN)
	})
	.catch(function(err){
		console.log("this is the error from trying to get the destinationLatLng " + err)
	})
}

userInput(('CAPRA WAY,SCOTT ST'), ("FRANCISCO ST,BAKER ST"));


//========================A STAR SEARCH=======================================================
async function dijkstraSearch(sourceNode, destinationNode, destinationLatLng, destinationCNN) {
	let frontier = new PriorityQueue(); // We're assuming such a class exists.
	let explored = new Set();
	let queueObj = {
		node: sourceNode,
		cost: 0,
		path: []
	};
	frontier.enqueue(queueObj, queueObj.cost);
	// Search until we're out of nodes
	while(frontier.length > 0) {
		let currentQueueObj = frontier.dequeue();
		let curNode = currentQueueObj['objeeee']['node'];
		let curPath = currentQueueObj['objeeee']['path'];
		let curCost = currentQueueObj['objeeee']['cost'];
		//console.log(curNode['cnn'], 'is this the erro? ')
		let curCnn = curNode.cnn;

		// Found a solution, return the path.
		if(curCnn === destinationCNN) {
			console.log('we made it!!!')
			console.log(curPath, " we made it!!!!!");

			return curPath;
		}
		if(explored.has(curNode)) {
			 console.log(curNode.cnn, ' this has already been explored')
			continue;
		}

		for(let i = 0; i < curNode.streetEdges.length; i++) {
			let curNodeEdges = curNode.streetEdges[i];
			let newNodeCNN;
			if(curNodeEdges.first !== curCnn){
				newNodeCNN = curNodeEdges.first;
			} else {
				newNodeCNN = curNodeEdges.second;
			}
			let newEdgeWeight = curNode.streetEdges[i].weight;
			let newNode = cnnObject[newNodeCNN];
			let newPath = curPath.slice();
			newPath.push(curNode);
			try{
				var heuristicValue = await computeHeuristic(newNode, destinationLatLng);
			}
			catch(err){
				console.log(err, 'this is the err in the try catch block')
				return;
			}

			if(heuristicValue === 'no address exsists'){
				explored.add(newNode);
			} else {

				let newQueueObj = {
					node: newNode,
					path: newPath,
					cost: newEdgeWeight + curCost // NOTE: No heuristic here -- thats correct
				}
				frontier.enqueue(newQueueObj, newQueueObj.cost + heuristicValue);
			}
		}
		// console.log(curNode.cnn)
		explored.add(curNode);
	}
	console.log('not working, fix it')
	return 'not working, fix it';
}

//========================COMPUTES THE HEURISTIC=======================================================
function computeHeuristic(currNode, finalLatLong){
	var cnn = currNode["cnn"];
	var currNodeIntersection = currNode["intersection1"]
	if(currNodeIntersection.indexOf("  \\ ") !== -1){
		currNodeIntersection = fixSlashes(currNodeIntersection)
	}
	if(latLngObject[cnn]){
		return latLngObject[cnn];
	} else {
		return getLatLng(currNodeIntersection)
		.then(function(response){
			if(response === 'no address exsists'){
				return 'no address exsists'
			} else {
				var currNodeLatLong = response
				var distance = latLngDistance(currNodeLatLong, finalLatLong);
				return distance;
			}
		})
		.catch(function(err){
			console.log(err, ' this is the error in computeHeuristic')
			return err
		})
	}
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
// 		request("https://maps.googleapis.com/maps/api/geocode/json?address=" + firstStreet + "+and+" + secondStreet + ",+San+Francisco,+CA" + "&key=AIzaSyC9FPqo6Pdx4VjALRx5oeEDhfQvb-fkDjE", function (error, response, body) {
// 			if (!error && response.statusCode == 200) {
// 				var parsed = JSON.parse(body);
// 				// console.log(parsed, 'this is the results')
// 				if(parsed["status"] === 'ZERO_RESULTS'){
// 					// console.log('the ' + intersectionArray + ' does not exisits')
// 					resolve('no address exsists')
// 				} else {
// 					// console.log('this intersction does exsisit ', parsed["results"][0]["geometry"]["location"])
// 					resolve(parsed["results"][0]["geometry"]["location"]);
// 				}
// 				// console.log(parsed["results"][0], " parsed ASDFASDFASDF", intersectionArray, "Intersection Array")
// 			} else {
// 				reject(err)
// 			}
// 		});
// 	});
// 	// console.log(p, " this is P");
// 	// return p;
// }

//========================GETS DISTANCE BETWEEN TWO LAT LONG POINTS===================================================
function latLngDistance(currNodeLatLong, finalLatLong, unit = "K") {
	var lat1 = currNodeLatLong.lat;
	var lon1 = currNodeLatLong.lng;
	var lat2 = finalLatLong.lat;
	var lon2 = finalLatLong.lng;
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit=="K") {dist = dist * 1.609344};
	if (unit=="N") {dist = dist * 0.8684};
	return dist;
}


//========================REMOVES LSAHSES FROM INTERSECTION======================================================
export function fixSlashes(arr){
	//"03RD ST,KEARNY ST \\ MARKET ST"
	// console.log(arr, 'this is the arr')

	if(arr[0].indexOf(' \\ ') !== -1){
		//console.log('herehe now', arr[0])
		var newStreet = arr[0].split(' \\')[0]
		//console.log(newStreet, 'hereeeeer newstreet1')
		return newStreet+','+arr[1]

	} else {
		var newStreet2 = arr[1].split(' \\')[0]
		//console.log(newStreet2, 'hereeeer newstreet2')
		return arr[0]+','+newStreet2
	}
}
