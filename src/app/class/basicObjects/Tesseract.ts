import GeometicShape, { GeometicShapeOptions } from "../GeometricShape";

interface TesseractOptions extends GeometicShapeOptions { }

export default class Tesseract extends GeometicShape {
  constructor(options: TesseractOptions = {}) {
    super(4, options);
  }
}