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
import { GraphNode, GraphEdge } from './graph';

function bubbleSort(arr) {
  if (arr.length === 1) {
    return arr;
  }
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j].cost > arr[j + 1].cost) {
        const swap = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = swap;
      }
    }
  }
  return arr;
}

export default function PriorityQueue() {
  this.pQueue = [];
  this.length = 0;
}

PriorityQueue.prototype.enqueue = function (objeeee, cost) {
  const holder = { objeeee, cost };
  this.pQueue.push(holder);
  if (this.pQueue.length > 1) {
    this.pQueue = bubbleSort(this.pQueue);
  }
  this.length ++;
  return this.pQueue;
};

PriorityQueue.prototype.dequeue = function () {
  const removed = this.pQueue.shift();
  this.length --;
  return removed;
};

// This represents an undirected Graph
function Graph() {
  this.nodes = [];
  this.edges = [];

  // Helper function to find a node in nodes
  this.findNode = (value) => {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].value === value) {
        return this.nodes[i];
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

  // Stretch!
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
    frontier.push(queueObj);
    // console.log(frontier)

    while (frontier.length > 0) {
      const curr_node = frontier.shift();
      const curr_path = curr_node.path;
      const curr_cost = curr_node.cost;
      const neigh = this.findNeighbors(curr_node.node);
      if (curr_node.node === finish) {
        return curr_path;
      }

      if (visited.has(curr_node.node)) {
        continue;
      }

      for (let i = 0; i < neigh.length; i++) {
        var new_node;
        if (neigh[i].first.value !== curr_node) {
          new_node = neigh[i].first.value;
        } else {
          new_node = neigh[i].second.value;
        }
        const new_path = curr_path.slice();
        new_path.push(neigh[i]);
        const new_cost = neigh[i].weight;
        const total_cost = new_cost + curr_cost;
        frontier.push({ node: new_node, path: new_path, cost: total_cost });
        visited.add(curr_node);
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
