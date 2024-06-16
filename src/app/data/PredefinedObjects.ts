import { ColorRepresentation, Vector4 } from "three"
import { Point, Line, Square, Cube, Tesseract } from "./../class/basicObjects/AllObjects";

// Constants for bit masks
const BIT_MASKS = {
  X: 8,
  Y: 4,
  Z: 2,
  W: 1
};

export type ObjectSet = Point | Line | Square | Cube | Tesseract;
export type ObjectArraySet = Point[] | Line[] | Square[] | Cube[] | Tesseract[];

export type PredefinedObjectsNameList =
  'normPoint' | 'normLine' | 'normSquare' | 'normCube' | 'normTesseract' |
  'centerLine' | 'centerSquare' | 'centerCube' | 'centerTesseract' |
  'invariantPoints' | 'multiCube' | 'multiTesseract';
export type PredefinedObjectsTypeList =
  'normal' | 'center' | 'multiStructure';

class PredefinedObject {
  private _name: PredefinedObjectsNameList;
  private _type: PredefinedObjectsTypeList;
  private _object: ObjectSet | ObjectArraySet;
  private _description: string;
  private _toDraw: boolean;
  private _isDraw: boolean = false;

  constructor(
    name: PredefinedObjectsNameList,
    type: PredefinedObjectsTypeList,
    object: ObjectSet | ObjectArraySet,
    description: string,
    toDraw: boolean = false
  ) {
    this._name = name;
    this._type = type;
    this._object = object;
    this._description = description;
    this._toDraw = toDraw;
  }

  get name() { return this._name; }
  get type() { return this._type; }
  get object() { return this._object; }
  get description() { return this._description; }
  get toDraw() { return this._toDraw; }
  get isDraw() { return this._isDraw; }


  set toDraw(value: boolean) { this._toDraw = value; }
  set isDraw(value: boolean) { this._isDraw = value; }
}

export class PredefinedObjectsList {
  private _list: PredefinedObject[] = [];
  add(predefinedObject: PredefinedObject) {
    this._list.push(predefinedObject)
  }
  get list(): PredefinedObject[] { return this._list }

  setDraw(name: PredefinedObjectsNameList, toDraw: boolean) {
    this._list.find((predefinedObject) => predefinedObject.name === name)!.toDraw = toDraw;
  }

  getPredefinedObject(name: PredefinedObjectsNameList) { 
    return this._list.find((predefinedObject) => predefinedObject.name === name)!
  };
}

export const predefinedObjectsList = new PredefinedObjectsList();

// normal objects; start Point zero is on (0,0,0,0)
predefinedObjectsList.add(new PredefinedObject(
  'normPoint', 'normal', new Point({ offset: new Vector4(0, 0, 0, 0) }),
  'Point on (0,0,0,0)'));
predefinedObjectsList.add(new PredefinedObject(
  'normLine', 'normal', new Line({ offset: new Vector4(0,0, 0, 0) }),
  'Line from (0,0,0,0) to (1,0,0,0)'));
predefinedObjectsList.add(new PredefinedObject(
  'normSquare', 'normal', new Square({ offset: new Vector4(0, 0, 0, 0) }),
  'Square on (0,0,0,0) to (1,1,0,0)'));
predefinedObjectsList.add(new PredefinedObject(
  'normCube', 'normal', new Cube({ offset: new Vector4(0, 0, 0, 0) }),
  'Cube from (0,0,0,0) to (1,1,1,0)'));
predefinedObjectsList.add(new PredefinedObject(
  'normTesseract', 'normal', new Tesseract({ offset: new Vector4(0, 0, 0, 0) }),
  'Tesseract from (0,0,0,0) to (1,1,1,1)'));

predefinedObjectsList.add(new PredefinedObject(
  'centerLine', 'center', new Line({ offset: new Vector4(-0.5, 0, 0, 0) }),
  'Line from (-0.5,0,0,0) to (0.5,0,0,0); center is on (0,0,0,0)'));
predefinedObjectsList.add(new PredefinedObject(
  'centerSquare', 'center', new Square({ offset: new Vector4(-0.5, -0.5, 0, 0) }),
  'Square on (-0.5,-0.5,0,0) to (0.5,0.5,0,0); center is on (0,0,0,0)'));
predefinedObjectsList.add(new PredefinedObject(
  'centerCube', 'center', new Cube({ offset: new Vector4(-0.5, -0.5, -0.5, 0) }),
  'Cube  on (-0.5,-0.5,0.5,0) to (0.5,0.5,0.5,0); center is on (0,0,0,0)', true));
predefinedObjectsList.add(new PredefinedObject(
  'centerTesseract', 'center', new Tesseract({ offset: new Vector4(-0.5, -0.5, -0.5, -0.5) }),
  'Tesseract on (-0.5,-0.5,-0.5,-0.5) to (0.5,0.5,0.5,0.5); center is on (0,0,0,0)'));



// multiStructure

// invariant Points are fix if rotate in XW,YW and ZW at same time  [ x+y+z = 0 ]
predefinedObjectsList.add(new PredefinedObject(
  'invariantPoints', 'multiStructure', createInvariantPoints(),
  'The invariant points remain unchanged when the rotation planes XW, YW, and ZW rotate.'));
// 8 cubes touching, 2 in X, 2 in Y and 2 in Z, center by (0,0,0)
predefinedObjectsList.add(new PredefinedObject(
  'multiCube', 'multiStructure', createMultiCube(),
  'Cubes arranged in a 2x2x2 grid, with each cube having an edge length of 1. Altogether, this forms a cube with an edge length of 2.'));
// 16 tesseracts touching, 2 in X, 2 in Y, 2 in Z and 2 in W, center by (0,0,0)
predefinedObjectsList.add(new PredefinedObject(
  'multiTesseract', 'multiStructure', createMultiTesseract(),
  'Tesseracts arranged in a 2x2x2x2 grid, with each tesseract having an edge length of 1. Altogether, this forms a tesseract with an edge length of 2.'));



function createInvariantPoints() {
  return new Array(Math.pow(2, 4))
    .fill(0)
    .map((_, id) => ({ value: id, binary: id.toString(2).padStart(4, '0') }))
    .filter((point) => {
      if ((point.value & BIT_MASKS.W) > 0)
        return false;
      return (
        ((point.value & BIT_MASKS.X) ? 1 : 0) +
        ((point.value & BIT_MASKS.Y) ? 1 : 0) +
        ((point.value & BIT_MASKS.Z) ? 1 : 0)
      ) === 2;
    })
    .reduce((result: Vector4[], point) => {
      const firstIndex = point.binary.indexOf('1');
      const secondIndex = point.binary.indexOf('1', firstIndex + 1);

      return [
        ...result,
        new Vector4(
          (firstIndex === 0) ? 1 : (secondIndex === 0) ? -1 : 0,
          (firstIndex === 1) ? 1 : (secondIndex === 1) ? -1 : 0,
          (firstIndex === 2) ? 1 : (secondIndex === 2) ? -1 : 0,
          0
        ),
        new Vector4(
          (firstIndex === 0) ? -1 : (secondIndex === 0) ? 1 : 0,
          (firstIndex === 1) ? -1 : (secondIndex === 1) ? 1 : 0,
          (firstIndex === 2) ? -1 : (secondIndex === 2) ? 1 : 0,
          0
        )
      ]
    }, [])
    .map(pointOffset => { return new Point({ offset: pointOffset, color: 0x0000FF }) });
}
function createMultiCube() {
  return new Array(Math.pow(2, 3))
    .fill(0)
    .map((_, id) => ({ value: id << 1, binary: (id << 1).toString(2).padStart(4, '0') }))
    .reduce((result: Vector4[], point) => {
      return [
        ...result,
        new Vector4(
          ((point.value & BIT_MASKS.X) === 0 ? -1 : 0),
          ((point.value & BIT_MASKS.Y) === 0 ? -1 : 0),
          ((point.value & BIT_MASKS.Z) === 0 ? -1 : 0),
          0
        )
      ]
    }, [])
    .map(pointOffset => { return new Cube({ offset: pointOffset, color: 0x0000FF }) });
}
function createMultiTesseract() {
  return new Array(Math.pow(2, 4))
    .fill(0)
    .map((_, id) => ({ value: id, binary: (id).toString(2).padStart(4, '0') }))
    .reduce((result: Vector4[], point) => {
      return [
        ...result,
        new Vector4(
          ((point.value & BIT_MASKS.X) === 0 ? -1 : 0),
          ((point.value & BIT_MASKS.Y) === 0 ? -1 : 0),
          ((point.value & BIT_MASKS.Z) === 0 ? -1 : 0),
          ((point.value & BIT_MASKS.W) === 0 ? -1 : 0),
        )
      ]
    }, [])
    .map(pointOffset => { return new Tesseract({ offset: pointOffset, color: 0x0000FF }) });
}