import UnitLine, { PointValue, PointList, AdjacencySet } from "./UnitLine";

/**
 * Represents an Eulerian circuit through a set of edges (unit lines).
 */
export default class EulerianCircuit {
  private _edges: UnitLine[]
  private _adjacencySet!: AdjacencySet;
  private _circuit!: PointList;

  /**
   * Returns the Eulerian circuit as a list of point values.
   */
  public get circuit(): PointList {
    return this._circuit;
  }

  /**
   * Creates a new EulerianCircuit instance from a set of unit lines.
   * @param edges - The set of unit lines to find the Eulerian circuit for.
   */
  constructor(edges: UnitLine[]) {
    if (edges.length === 0) {
      throw new Error("There must be at least one edge.");
    }
    
    this._edges = edges;

    this.createEulerianCircuit();
  }

  /**
   * Creates the Eulerian circuit from the given set of unit lines.
   */
  private createEulerianCircuit(): void {
    this.createAdjacency();
    this.addNecessaryEdges();
    this.findEulerianCircuit();
  }

  /**
   * Creates an adjacency set from the given set of unit lines.
   */
  private createAdjacency(): void {
    this._adjacencySet = this._edges.reduce((mergedMap, edge) => {
      const edgeAdjacencySet = edge.adjacencySet;

      // Iterate over each point-adjacentPoints pair in the edge's adjacency set
      edgeAdjacencySet.forEach((value, key) => {
        // If the point already exists in the merged map
        if (mergedMap.has(key)) {
          // Get the existing adjacent points for that point
          const existingValues = mergedMap.get(key)!;

          // Create a new set to remove duplicates, combine the existing adjacent points
          // with the new adjacent points from the current edge, and convert back to an array
          mergedMap.set(key, Array.from(new Set([...existingValues, ...value])));
        } else {
          // If the point is not yet in the merged map, add it with its adjacent points
          mergedMap.set(key, value);
        }
      });

      return mergedMap;
    }, new Map<PointValue, PointList>());
  }

  /**
    * Adds the necessary edges to make the graph Eulerian if it has an Eulerian path.
    */
  private addNecessaryEdges(): void {
    const oddDegreeNodes: PointValue[] = [];


    // Find nodes with odd degree
    for (const [node, adjacentNodes] of this._adjacencySet) {
      if (adjacentNodes.length % 2 !== 0) {
        oddDegreeNodes.push(node);
      }
    }

    // Add edges to connect odd degree nodes
    while (oddDegreeNodes.length > 0) {
      const node1 = oddDegreeNodes.pop()!;
      const node2 = this._adjacencySet.get(node1)!.filter(v => oddDegreeNodes.indexOf(v) !== -1)[0];

      oddDegreeNodes.splice(oddDegreeNodes.indexOf(node2), 1);

      // Update adjacency set
      this._adjacencySet.get(node1)!.push(node2);
      this._adjacencySet.get(node2)!.push(node1);
    }
  }

  /**
   * Finds the Eulerian circuit or path through the set of unit lines.
   */
  private findEulerianCircuit() {
    // Create a local copy of the adjacency set to avoid modifying the original
    const localAdjacencySet = new Map<PointValue, PointList>(this._adjacencySet);

    const circuit: PointList = [];
    const stack: PointList = [];

    // Start from an arbitrary node
    const startNode = localAdjacencySet.keys().next().value;
    stack.push(startNode);


    // Traverse the adjacency set using a stack
    while (stack.length > 0) {
      const currentNode = stack[stack.length - 1];

      // If the current node has adjacent nodes
      if (localAdjacencySet.get(currentNode) && localAdjacencySet.get(currentNode)!.length > 0) {

        // Take the next adjacent node and push it to the stack
        const nextNode = localAdjacencySet.get(currentNode)!.pop()!;
        stack.push(nextNode);

        // Remove the back-edge from nextNode to currentNode in the local adjacency set
        const nextNodeAdj = localAdjacencySet.get(nextNode);
        if (nextNodeAdj) {
          const index = nextNodeAdj.indexOf(currentNode);
          if (index > -1) {
            nextNodeAdj.splice(index, 1);
          }
        }
      } else {
        // If no adjacent nodes left, add the current node to the circuit
        circuit.push(stack.pop()!);
      }
    }
    this._circuit = circuit;
  }
}