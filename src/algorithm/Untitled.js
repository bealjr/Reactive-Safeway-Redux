function formatInput(origin, destination){
	let newOrigin,
		newDestination;

	if(origin.indexOf("and") > -1){
		newOrigin = origin.split("and");
	}
	if(origin.indexOf("&") > -1){
		newOrigin = origin.split("&");
	}

	if(destination.indexOf("and") > -1){
		newDestination = destination.split("and");
	}
	if(destination.indexOf("&") > -1){
		newDestination = destination.split("&");
	}

	return [ newOrigin.map((str) => str.trim().toUpperCase()).join(","), newDestination.map((str) => str.trim().toUpperCase()).join(",") ];
};

//transform output into something that google maps api can read so that we can render our route on the map=
function formatOutput(pathOfNodes){
	let outputArray = [];

	for(let i = 0; i < pathOfNodes.length; i++){
		let currentIntersection = pathOfNodes[i].intersection1;

		outputArray.push(currentIntersection);
	}
	return outputArray;
}
