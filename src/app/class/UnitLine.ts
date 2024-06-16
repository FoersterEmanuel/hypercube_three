import UnitPoint from "./UnitPoint";

export type PointValue = number;
export type PointList = PointValue[];
export type AdjacencySet = Map<PointValue, PointList>;

/**
 * Represents a unit line between two points.
 */
export default class UnitLine {

  private _point_A: UnitPoint;
  private _point_B: UnitPoint;
  private _adjacencySet = new Map<PointValue, PointList>();

  /**
     * Returns the start point of the line.
     */
  public get point_A(): UnitPoint {
    return this._point_A;
  }

  /**
   * Returns the end point of the line.
   */
  public get point_B(): UnitPoint {
    return this._point_B;
  }

  /**
     * Returns the adjacency set for this line.
     * @returns A Map containing the adjacent points for each endpoint.
     */
  public get adjacencySet(): AdjacencySet {
    return this._adjacencySet;
  }

  /**
     * Creates a new UnitLine instance.
     * @param point_A - The start point of the line.
     * @param point_B - The end point of the line.
     */
  constructor(
    point_A: UnitPoint,
    point_B: UnitPoint
  ) {
    if (!point_A || !point_B) {
      throw new Error('Points must be defined');
    }
    this._point_A = point_A;
    this._point_B = point_B;

    this.initializeAdjacencySet();
  }

  /**
   * Initializes the adjacency set for this line.
   */
  private initializeAdjacencySet(): void {
    this._adjacencySet.set(this._point_A.value, [this._point_B.value]);
    this._adjacencySet.set(this._point_B.value, [this._point_A.value]);
  }

}