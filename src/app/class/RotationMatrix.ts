import { Matrix4 } from "three";

export type RotationPlane = 'XY' | 'XZ' | 'XW' | 'YZ' | 'YW' | 'ZW';

const AxisMask = ["X", "Y", "Z", "W"];
// Constants for bit masks
const BIT_MASKS = {
  X: 1,
  Y: 2,
  Z: 4,
  W: 8
};

class RotationMatrix {
  private _plane: RotationPlane;
  private _preMatrix: (number|'s'|'c'|'d')[];
  private _doActive: boolean = false;

  constructor(
    plane: RotationPlane
  ) {
    this._plane = plane;
    this._preMatrix = this.createPreMAtrix()
  }

  get doActive(){ return this._doActive; }
  set doActive(value:boolean){ this._doActive=value; }

  private createPreMAtrix():(number|'s'|'c'|'d')[] {
    const firstIndex = AxisMask.indexOf((this._plane as string).split('')[0]);
    const secondIndex = AxisMask.indexOf((this._plane as string).split('')[1]);

    return new Array(Math.pow(2, 4))
      .fill(0)
      .flatMap((_, id) => {
        const firstPos = id % 4;
        const secondPos = Math.floor(id / 4);

        if (
          [firstIndex, secondIndex].indexOf(firstPos) >= 0 &&
          [firstIndex, secondIndex].indexOf(secondPos) >= 0
        ) {
          if (
            firstIndex === firstPos && firstIndex === secondPos ||
            secondIndex === firstPos && secondIndex === secondPos
          )
            return 'c' // placeholder for cos
          if (firstIndex === firstPos && secondIndex === secondPos)
            return 's'; // placeholder for  sin
          return 'd'; // placeholder for  -sin
        } else if (firstPos === secondPos)
          return 1;
        return 0;
      });
  }
  getMatrix(angle: number = 0) {
    const calc = {
      's': Math.sin(angle),
      'c': Math.cos(angle),
      'd': -Math.sin(angle)
    };

    const test:number[] =  this._preMatrix.map((value:number|'s'|'c'|'d') => {
      if (value===0||value===1)
        return value;
      return calc[value as ('s'|'c'|'d')];
    });
    return (new Matrix4()).fromArray(test);
  }
}

export class RotationMatrixs {
  private _planes!: { [key in RotationPlane]: RotationMatrix };
  private _planeNames: RotationPlane[];

  get planes() { return this._planes; }
  get planeNames() { return this._planeNames; }


  constructor() {
    this._planeNames = this.createPlaneName();

    this._planes = this._planeNames.reduce((acc: { [key in RotationPlane]: RotationMatrix }, planeName: RotationPlane) => {
      acc[planeName] = new RotationMatrix(planeName);
      return acc;
    }, {} as { [key in RotationPlane]: RotationMatrix });


    // console.log(this._planes['XY'].getMatrix(Math.PI*2));//Math.PI));
  }

  private createPlaneName(): RotationPlane[] {
    return new Array(Math.pow(2, 4))
      .fill(0)
      .map((_, id) => id)
      .reverse()
      .filter((id) => {
        const bitsSum = (
          ((id & BIT_MASKS.X) ? 1 : 0) +
          ((id & BIT_MASKS.Y) ? 1 : 0) +
          ((id & BIT_MASKS.Z) ? 1 : 0) +
          ((id & BIT_MASKS.W) ? 1 : 0)
        );
        return bitsSum === 2;
      })
      .map((id) => {
        const binary = id.toString(2).padStart(4, "0");

        const firstIndex = binary.indexOf('1');
        const secondIndex = binary.indexOf('1', firstIndex + 1);

        const plane = AxisMask[firstIndex] + AxisMask[secondIndex];
        return plane as RotationPlane;
      });
  }

  public setRotation(name: RotationPlane, value: boolean){
    this._planes[name].doActive = value;
  }
  public getFullRotationMatrix(angle: number): Matrix4{
    const matrix = new Matrix4();
    this._planeNames.forEach((name) => {
      if(this._planes[name].doActive)
        matrix.multiply(this._planes[name].getMatrix(angle))
    });
    return matrix;
  }
}