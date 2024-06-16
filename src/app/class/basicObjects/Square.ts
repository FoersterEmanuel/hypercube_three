import { ColorRepresentation, Vector4 } from "three";
import GeometicShape, { GeometicShapeOptions } from "./../GeometricShape";

interface SquareOptions extends GeometicShapeOptions { }

export default class Square extends GeometicShape {
  constructor(options: SquareOptions = {}) {
    super(2,options);
  }
}