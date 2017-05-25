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
import { GraphNode, GraphEdge } from './graph'

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

export default function PriorityQueue(){
    this.pQueue = [];
    this.length = 0;
}

PriorityQueue.prototype.enqueue = function (objeeee, cost) {
    var holder = {objeeee, cost}
    this.pQueue.push(holder);
    if(this.pQueue.length > 1){
        // console.log('push isi hereheheheherhreeh', this.pQueue, 'push isi hereheheheherhreeh')
        this.pQueue = bubbleSort(this.pQueue)
    }
    this.length ++;
    return this.pQueue;
};

PriorityQueue.prototype.dequeue = function(){
    var removed = this.pQueue.shift()
    this.length --;
    return removed;
}
//This represents an undirected Graph
function Graph() {

  this.nodes = [];
  this.edges = [];

  // Helper function to find a node in nodes
  this.findNode = function (value) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].value == value) {
        return this.nodes[i];
      }
    }
    return null;
  }

  // Add a node to the list of nodes
  this.addNode = function(value) {
    if (this.findNode(value) != null) {
      return;
    }
    this.nodes.push(new GraphNode(value));
  }

  // Add an edge between 2 nodes and give it a weight
  this.addEdge = function(source, destination, weight) {
    let first = this.findNode(source);
    let second = this.findNode(destination);
    if (first == null || second == null) {
      return;
    }
    this.edges.push(new GraphEdge(first, second, weight));
  }

  // Get the size of the graph by returning how many nodes are in the graph
  this.size = function() {
    var length = this.nodes.length;
    return length;
  };

  // Find the total number of edges in the graph
  this.numEdges = function() {
    var num = this.edges.length;
    return num;
  };

  // Find the total weight of the graph by adding up the weights of each edge
  this.weight = function() {
    var weight = 0;
    for (var i = 0; i < this.edges.length; i++) {
      // console.log(typeof this.edges[i].weight)
      weight += this.edges[i].weight;
    }
    return weight;
  };

  // Find all node values a node is connected to.
  // Return all node values at the other side of an edge of the target node
  // Remember that edges are not directional: A -> B also implies B -> A
  this.findNeighbors = function(value) {
    var neighbors = [];
    for (var i = 0; i < this.edges.length; i++) {
      // console.log(this.edges[i].first)
      if(this.edges[i].first.value === value){
        neighbors.push(this.edges[i]);
      }
      if(this.edges[i].second.value === value){
        neighbors.push(this.edges[i]);
      }
    }
    return neighbors;
  }

  // Stretch!
  // Find the optimal route from start to finish
  // Return each edge required to traverse the route
  // Remember that edges are not directional: A -> B also implies B -> A
  this.findPath = function(start, finish) {
    var frontier = new PriorityQueue();
    var visited = new Set();

    let queueObj = {
    node: start,
    cost: 0,
    path: []
  };
    frontier.push(queueObj)
    // console.log(frontier)

    while(frontier.length > 0){
        var curr_node = frontier.shift();
        // console.log(curr_node, 'current node in while lopp')
        var curr_path = curr_node.path;
        var curr_cost = curr_node.cost;
        var neigh = this.findNeighbors(curr_node.node);
        // console.log(neigh, 'neighbors')
        if(curr_node.node === finish){
            // console.log(curr_path)
            return curr_path;
        }

        if(visited.has(curr_node.node)){
            continue;
        }

        for (var i = 0; i < neigh.length; i++) {
            var new_node;
            if(neigh[i].first.value !== curr_node){
                new_node = neigh[i].first.value
            } else {
                new_node = neigh[i].second.value
            }
            var new_path = curr_path.slice();
            new_path.push(neigh[i]);
            var new_cost = neigh[i].weight;
            var total_cost = new_cost + curr_cost;
            // console.log('this cost for ' + neigh[i] + ' is ' + total_cost)
            // queueObj['node'] = new_node;
            // queueObj['path'] = new_path;
            // queueObj['cost'] = total_cost;
            // frontier.push(queueObj)
            frontier.push({'node': new_node, 'path': new_path, 'cost': total_cost})
            // console.log(frontier, 'after frontier push');
            visited.add(curr_node)
        }
    }
    // console.log("finised no solution");
    return 10

  }

  // Return a list of any nodes that are orphans.
  // An orphan is any node with no edges.
  this.findOrphans = function() {
      //console.log(this.nodes[1])
    var currList = [];
    for (var i = 0; i < this.nodes.length; i++) {
        currList.push(this.nodes[i])
        //console.log(nodes)
    }
    var arr = []
    console.log(currList)
    for (var j = 0; j < currList.length; j++) {
        var curr = currList[j].value
        console.log(typeof curr, 'curr')
        for (var k = 0; k < this.edges.length; k++) {
            console.log(typeof this.edges[k].first.value, 'edges value')
            if(curr !== this.edges[k].first.value && curr !== this.edges[k].second.value)
            arr.push(curr)
        }
    }
    return arr;
  }

  this.print = function() {
    for (let i = 0; i < this.edges.length; i++) {
      let edge = this.edges[i];
      //console.log(edge.first.value, '->', edge.second.value, edge.weight, 'mi');
    }
  }

  this.pathWeight = function(path) {
    let sum = 0;
    for (let i = 0; i < path.length; i++) {
      sum += path[i].weight;
    }
    return sum;
  }
 }
