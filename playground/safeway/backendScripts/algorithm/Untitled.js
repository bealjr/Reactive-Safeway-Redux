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
	let outputArray = ["Start by walking to the intersection of: ", pathOfNodes[0].intersection1[0], " and ", 				pathOfNodes[0].intersection1[1], "."],
		heading = findCommonStreet(pathOfNodes[0].intersection1, pathOfNodes[1].intersection1),
		currentStreet = heading.CS,
		towardsStreet = heading.TS,
		numberOfBlocks = 0,
		sameStreet = function(numberOfBlocks){
			return numberOfBlocks > 0 ? true : false;
		}

		console.log(heading);

	for(let i = 1; i < pathOfNodes.length; i++){
		let currentIntersection = pathOfNodes[i].intersection1,
			previousIntersection = pathOfNodes[i-1].intersection1;

		if(currentStreet === currentIntersection[0] || currentStreet === currentIntersection[1]){
			outputArray.push(" Stay on ", currentStreet);
			numberOfBlocks++

		} else {

			heading = findCommonStreet(currentIntersection, previousIntersection)
			currentStreet = heading.cs;
			towardsStreet = heading.ts;

			outputArray.push(" for ", numberOfBlocks, " blocks.");
			outputArray.push("Then turn on ", currentStreet, " towards ", towardsStreet)

		}
	}
	outputArray.push(" You've arrived at your destination!");
	return outputArray;
}

function findCSandTS(intersection1, intersection2){
	if(intersection1[0] === intersection2[0]) return {CS: intersection1[0], TS: intersection2[1]};
	if(intersection1[0] === intersection2[1]) return {CS: intersection1[0], TS: intersection2[0]};
	if(intersection1[1] === intersection2[0]) return {CS: intersection1[1], TS: intersection2[1]};
	if(intersection1[1] === intersection2[1]) return {CS: intersection1[1], TS: intersection2[0]};
}
