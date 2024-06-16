import GeometicShape, { GeometicShapeOptions } from "./../GeometricShape";

interface PointOptions extends GeometicShapeOptions { }

export default class Point extends GeometicShape {
  constructor(options: PointOptions = {}) { 
    super(0,options);
  }
}