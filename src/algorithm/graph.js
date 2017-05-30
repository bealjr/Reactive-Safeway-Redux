import PriorityQueue from './priorityQueue';


const cnnObject = {};
const intersectionsObject = {};


export function GraphEdge(first, second, weight, crimeType) {
  this.first = first;
  this.second = second;
  this.weight = weight;
  this.crimeType = {};
}


export function GraphNode(intersection1, intersection2, cnn, latLng, streetEdges) {
  this.intersection1 = intersection1;
  this.intersection2 = intersection2;
  this.cnn = cnn;
  this.latLng = latLng;
  this.streetEdges = streetEdges || [];
}

// This represents an undirected Graph
export default function Graph() {
  this.nodes = [];
  this.edges = [];

  // Helper function to find a node in nodes

  this.findNode = function (value) {
    if (cnnObject[value]) {
      return cnnObject[value];
    }
  };

  // Add a node to the list of nodes

  this.addNode = function (intersection1, intersection2, cnn, latLng) {
    if (this.findNode(cnn)) {
      return;
    }

    const newNode = new GraphNode(intersection1, intersection2, cnn, latLng);
    cnnObject[cnn] = newNode;
    intersectionsObject[intersection1] = cnn;

    this.nodes.push(newNode);
    // console.log("THIS IS LATLNG " + latLng)
    // console.log(newNode.latLng);
  };


  // Add an edge between 2 nodes and give it a weight
  this.addEdge = function (source, destination, weight = 1) {
    const first = this.findNode(source);
	  const second = this.findNode(destination);
    if (first == null || second == null) {
      return;
    }
    const newEdge = new GraphEdge(source, destination, weight);
    this.edges.push(newEdge);
    first.streetEdges.push(newEdge);
    second.streetEdges.push(newEdge);
    // console.log(cnnObject, ' this is the cnnObject in the add edge method')
  };

  // Return insertion obj
  this.getCnnObject = function () {
      // console.log(cnnObject, ' this is the cnnObject in the method')
    return cnnObject;
  };

  this.getIntersectionsObject = function () {
    return intersectionsObject;
  };

  // Get the size of the graph by returning how many nodes are in the graph
  this.size = function () {
    const length = this.nodes.length;
    return length;
  };

  // Find the total number of edges in the graph
  this.numEdges = function () {
    const num = this.edges.length;
    return num;
  };

  // Find the total weight of the graph by adding up the weights of each edge
  this.weight = function () {
    let weight = 0;
    for (let i = 0; i < this.edges.length; i++) {
      // console.log(typeof this.edges[i].weight)
      weight += this.edges[i].weight;
    }
    return weight;
  };

  // Find all node values a node is connected to.
  // Return all node values at the other side of an edge of the target node
  // Remember that edges are not directional: A -> B also implies B -> A
  this.findNeighbors = function (value) {
    const neighbors = [];
    for (let i = 0; i < this.edges.length; i++) {
      // console.log(this.edges[i].first)
      if (this.edges[i].first.value === value) {
        neighbors.push(this.edges[i]);
      }
      if (this.edges[i].second.value === value) {
        neighbors.push(this.edges[i]);
      }
    }
    return neighbors;
  };

  this.findPath = function (start, finish) {
    const frontier = new PriorityQueue();
    const visited = new Set();

    const queueObj = {
      node: start,
      cost: 0,
      path: [],
    };
    frontier.push(queueObj);

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
  this.findOrphans = function () {
      // console.log(this.nodes[1])
    const currList = [];
    for (let i = 0; i < this.nodes.length; i++) {
      currList.push(this.nodes[i]);
        // console.log(nodes)
    }
    const arr = [];
    console.log(currList);
    for (let j = 0; j < currList.length; j++) {
      const curr = currList[j].value;
      console.log(typeof curr, 'curr');
      for (let k = 0; k < this.edges.length; k++) {
        console.log(typeof this.edges[k].first.value, 'edges value');
        if (curr !== this.edges[k].first.value && curr !== this.edges[k].second.value) { arr.push(curr); }
      }
    }
    return arr;
  };

  this.print = function () {
    for (let i = 0; i < this.edges.length; i++) {
      const edge = this.edges[i];
      // console.log(edge.first.value, '->', edge.second.value, edge.weight, 'mi');
    }
  };

  this.pathWeight = function (path) {
    let sum = 0;
    for (let i = 0; i < path.length; i++) {
      sum += path[i].weight;
    }
    return sum;
  };
}
