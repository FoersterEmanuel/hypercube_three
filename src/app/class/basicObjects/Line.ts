import GeometicShape, { GeometicShapeOptions } from "./../GeometricShape";

interface LineOptions extends GeometicShapeOptions { }

export default class Line extends GeometicShape {
  constructor(options: LineOptions = {}) {
    super(1, options);
  }
}