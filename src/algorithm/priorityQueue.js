// {"20010000":
// {"intersection1":["JAMESTOWN AVE","GILROY ST"],
// "intersection2":["GILROY ST","JAMESTOWN AVE"],
// "cnn":"20010000",
// "streetEdges":
// [{"first":"20010000",
// "second":"20435000",
// "weight":1,
// "crimeType":{}
// }]}

const GraphNode = require('./graph').GraphNode;
const GraphEdge = require('./graph').GraphEdge;




function bubbleSort(arr){
    if(arr.length === 1){
        return arr;
    }
    for(let i = 0; i < arr.length-1; i ++){
        // console.log(arr[i], 'this is the arr before sort')
        for(let j = 0; j < arr.length-1-i; j++){
            var one = arr[j].cost
            var two = arr[j+1].cost
            // console.log(one, 'cost', two);
            if(arr[j].cost> arr[j+1].cost){
                var swap = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = swap;
            }
        }
    }
    // console.log(arr, 'this is after sort')
    return arr
}


// //QuickSort Code
// let countOuter = 0;
// let countInner = 0;
// let countSwap = 0;
//
// function resetCounters() {
//   countOuter = 0;
//   countInner = 0;
//   countSwap = 0;
// }
// function QuickSort(array, left, right) {
//   countOuter++;
//   left = left || 0;
//   right = right || array.length - 1;
//
//   const pivot = partitionHoare(array, left, right);
//
//   if(left < pivot - 1) {
//     QuickSort(array, left, pivot - 1);
//   }
//   if(right > pivot) {
//     QuickSort(array, pivot, right);
//   }
//   return array;
// }
//
// // Hoare partition scheme... most efficient partition scheme for use in QuickSort.
// function partitionHoare(array, left, right) {
//   const pivot = Math.floor((left + right) / 2 );
//
//   while(left <= right) {
//     countInner++;
//     while(array[left] < array[pivot]) {
//       left++;
//     }
//     while(array[right] > array[pivot]) {
//       right--;
//     }
//     if(left <= right) {
//       countSwap++;
//       [array[left], array[right]] = [array[right], array[left]];
//       left++;
//       right--;
//     }
//   }
//   return left;
// }

class PriorityQueue {
    constructor(){
        this.pQueue = [];
        this.length = 0;
    }

    enqueue(obj, cost) {
      const queueObj = { obj, cost };
      this.pQueue.push(queueObj);
      if (this.pQueue.length > 1) {
        this.pQueue = bubbleSort(this.pQueue);
      }
      this.length ++;
      return this.pQueue;
    };

    dequeue() {
      const removed = this.pQueue.shift();
      this.length --;
      return removed;
    };
}


// This represents an undirected Graph
function Graph() {
  this.nodes = [];
  this.edges = [];

  // Helper function to find a node in nodes
  this.findNode = (value) => {
    for (let i = 0; i < this.nodes.length; i++) {
        const currentNode = this.nodes[i];
      if (currentNode.value === value) {
        return currentNode;
      }
    }
    return null;
  };

  // Add a node to the list of nodes
  this.addNode = (value) => {
    if (this.findNode(value) !== null) {
      return;
    }
    this.nodes.push(new GraphNode(value));
  };

  // Add an edge between 2 nodes and give it a weight
  this.addEdge = function (source, destination, weight) {
    const first = this.findNode(source);
    const second = this.findNode(destination);
    if (first == null || second == null) {
      return;
    }
    this.edges.push(new GraphEdge(first, second, weight));
  };

  // Get the size of the graph by returning how many nodes are in the graph
  this.size = () => this.nodes.length;


  // Find the total number of edges in the graph
  this.numEdges = () => this.edges.length;

  // Find the total weight of the graph by adding up the weights of each edge
  this.weight = () => {
    let weight = 0;
    for (let i = 0; i < this.edges.length; i++) {
      weight += this.edges[i].weight;
    }
    return weight;
  };

  // Find all node values a node is connected to.
  // Return all node values at the other side of an edge of the target node
  // Remember that edges are not directional: A -> B also implies B -> A
  this.findNeighbors = (value) => {
    const neighbors = [];
    for (let i = 0; i < this.edges.length; i++) {
      if (this.edges[i].first.value === value) {
        neighbors.push(this.edges[i]);
      }
      if (this.edges[i].second.value === value) {
        neighbors.push(this.edges[i]);
      }
    }
    return neighbors;
  };

  // Find the optimal route from start to finish
  // Return each edge required to traverse the route
  // Remember that edges are not directional: A -> B also implies B -> A
  this.findPath = (start, finish) => {
    const frontier = new PriorityQueue();
    const visited = new Set();

    const queueObj = {
      node: start,
      cost: 0,
      path: [],
    };
    frontier.enqueue(queueObj);
    // console.log(frontier)

    while (frontier.length > 0) {
      const currentQueueObj = frontier.dequeue();
      const currentPath = currentQueueObj.path;
      const currentCost = currentQueueObj.cost;

      if (currentQueueObj.node === finish) {
        return currentPath;
      }

      const currentNeighbors = this.findNeighbors(currentQueueObj.node);

      if (visited.has(currentQueueObj.node)) {
        continue;
      }

      for (let i = 0; i < currentNeighbors.length; i++) {
        var new_node;
        if (currentNeighbors[i].first.value !== currentQueueObj) {
          new_node = currentNeighbors[i].first.value;
        } else {
          new_node = currentNeighbors[i].second.value;
        }
        const new_path = currentPath.slice();
        new_path.push(currentNeighbors[i]);
        const new_cost = currentNeighbors[i].weight;
        const total_cost = new_cost + currentCost;
        frontier.enqueue({ node: new_node, path: new_path, cost: total_cost });
        visited.add(currentQueueObj);
      }
    }
    return 10;
  };

  // Return a list of any nodes that are orphans.
  // An orphan is any node with no edges.
  this.findOrphans = () => {
    const currList = [];
    for (let i = 0; i < this.nodes.length; i++) {
      currList.push(this.nodes[i]);
    }
    const arr = [];
    for (let j = 0; j < currList.length; j++) {
      const curr = currList[j].value;
      for (let k = 0; k < this.edges.length; k++) {
        if (curr !== this.edges[k].first.value && curr !== this.edges[k].second.value) { arr.push(curr); }
      }
    }
    return arr;
  };


  this.pathWeight = (path) => {
    let sum = 0;
    for (let i = 0; i < path.length; i++) {
      sum += path[i].weight;
    }
    return sum;
  };
}

module.exports = { PriorityQueue: PriorityQueue};
