import { BufferGeometry, ColorRepresentation, Line, LineBasicMaterial, Matrix4, Mesh, MeshBasicMaterial, NormalBufferAttributes, Object3DEventMap, SphereGeometry, Vector4 } from "three";
import UnitPoint, { UnitPointOptions } from "./UnitPoint";
import UnitLine, { PointList } from "./UnitLine";
import EulerianCircuit from "./EulerianeCircuit";

export interface GeometicShapeOptions extends UnitPointOptions {
  color?: ColorRepresentation;
}
interface GeometicShapeInterface {
  setRotationMatrix: (rotationMatrix:Matrix4)=>void,
  animate: ()=>void
}

export type GeometicShapeObjectResult = Line<BufferGeometry<NormalBufferAttributes>, LineBasicMaterial, Object3DEventMap> | Mesh<BufferGeometry<NormalBufferAttributes> | SphereGeometry, MeshBasicMaterial, Object3DEventMap>;

export default class GeometicShape implements GeometicShapeInterface {

  private points: UnitPoint[];
  private mainPoints: UnitPoint[];
  private edges?: UnitLine[];
  private eulerianPath?: EulerianCircuit;
  private graph?: UnitPoint[];
  private shapeObject?: GeometicShapeObjectResult;

  constructor(
    private dimensions: number,
    private options: GeometicShapeOptions = {}
  ) {
    const { color = 0x00FF00, scalingFactor = 1, offset = new Vector4(0, 0, 0, 0) } = this.options;
    this.points = this.createPoints(dimensions, scalingFactor, offset);
    this.mainPoints = this.createMainPoints(this.points);


    if (dimensions > 0) {
      this.edges = this.createEdges(this.mainPoints, this.points, dimensions);
      this.eulerianPath = new EulerianCircuit(this.edges);
      this.graph = this.createGraph(this.eulerianPath.circuit, this.points);
      this.shapeObject = this.createLine(this.graph, color);
    } else if (dimensions === 0) {
      this.shapeObject = this.createDot(this.points[0], color);
    }
  }

  /**
   * Getter to access the resulting object (line or dot)
   */
  get object() { return this.shapeObject; }

  // Method to create an array of UnitPoint instances based on dimensions, scaling factor, and offset
  private createPoints(dimensions: number, scalingFactor: number, offset: Vector4) {
    return new Array(Math.pow(2, dimensions))
      .fill(0)
      .map((_, i) => new UnitPoint(i, { scalingFactor, offset }))
  }

  // Method to filter out main corner points from an array of UnitPoint instances
  private createMainPoints(points: UnitPoint[]) {
    return points.filter(p => p.isMainCorner());
  }

  // Method to create an array of UnitLine instances connecting the main points
  private createEdges(mainPoints: UnitPoint[], points: UnitPoint[], dimensions: number) {
    return mainPoints
      .flatMap(p =>
        new Array(dimensions).fill(0).map((_, i) => {
          const neighbors = points.find(n => n.value === p.xor(Math.pow(2, i)))!;
          return new UnitLine(p, neighbors);
        })
      );
  }

  // Method to create an array of UnitPoint instances representing the graph from a path and array of points
  private createGraph(path: number[], points: UnitPoint[]) {
    return path.map(p => points.find(n => n.value === p)!);
  }

  // Method to create a Line object from an array of UnitPoint instances and a color
  private createLine(graph: UnitPoint[], color: ColorRepresentation) {
    const graphPoints = graph.map(p => p.getVector3Stereographic());
    const geometry = new BufferGeometry().setFromPoints(graphPoints);
    const material = new LineBasicMaterial({ color });
    return new Line(geometry, material);
  }

  // Method to create a Mesh object representing a dot from a UnitPoint instance and a color
  private createDot(point: UnitPoint, color: ColorRepresentation) {
    const { x, y, z } = point.getVector3Stereographic();
    const geometry = new SphereGeometry(0.02, 8, 8);
    const material = new MeshBasicMaterial({ color });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return mesh;
  }

  public setRotationMatrix(rotationMatrix:Matrix4){
    this.points.forEach(point => point.setRotationMatrix(rotationMatrix));
  }

  // Method to animate the geometric shape by rotating points and updating the geometry
  public animate() {
    this.points.forEach(point => point.rotate());
    if (this.dimensions > 0) {
      const graphPoints = this.graph?.map(p => p.getVector3Stereographic());
      this.shapeObject!.geometry.dispose();
      this.shapeObject!.geometry = new BufferGeometry().setFromPoints(graphPoints!);
    } else if (this.dimensions === 0) {
      const { x, y, z } = this.points[0].getVector3Stereographic();
      (this.shapeObject as Mesh).position.set(x, y, z);
    }
  }
}