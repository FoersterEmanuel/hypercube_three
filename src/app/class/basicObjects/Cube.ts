import GeometicShape, { GeometicShapeOptions } from "../GeometricShape";

interface CubeOptions extends GeometicShapeOptions { }

export default class Cube extends GeometicShape {
  constructor(options: CubeOptions = {}){
    super(3,options);
  }
}
