import { Matrix4, Vector3, Vector4 } from "three";
import rotationMatrix, { RotationPlane } from "./helper/RotationMatrix";

export interface UnitPointOptions {
  scalingFactor?: number;
  offset?: Vector4;
}

// Constants for bit masks
const BIT_MASKS = {
  X: 1,
  Y: 2,
  Z: 4,
  W: 8
};

// Constant for rotation angle
const ROTATION_ANGLE = 0.01;

/**
 * Represents a point in a 4D space with various transformation methods.
 * @param value - Reference Point of the Cube Object
 * @param options - optional options scalingFactor and offset
 */
export default class UnitPoint {
  private _value: number;
  private _scalingFactor: number;
  private _offset: Vector4;
  private _binary: string;
  private _vector: Vector4;
  private _orgVector: Vector4;
  private _rotationMatrix4D: Matrix4 = new Matrix4();
  private _doRotation: {[key in RotationPlane]: boolean} = {
    XY: false,
    XZ: false,
    XW: false,
    YZ: false,
    YW: false,
    ZW: false
  };
  private _alternateProjectionFactor = 1;


  private _distance = Math.PI;

  /**
   * Get the value of the point.
   */
  public get value(): number { return this._value; }  
 
  constructor(
    value: number, options: UnitPointOptions = {},
  ) {
    this._value = value;
    this._scalingFactor = options.scalingFactor ?? 1;
    this._offset = options.offset ?? new Vector4(0, 0, 0, 0);

    this._vector = new Vector4(
      (this.value & BIT_MASKS.X) ? 1 : 0,
      (this.value & BIT_MASKS.Y) ? 1 : 0,
      (this.value & BIT_MASKS.Z) ? 1 : 0,
      (this.value & BIT_MASKS.W) ? 1 : 0
    );
    this._vector.add(this._offset);
    this._orgVector = this._vector.clone();

    this._binary = this._vector.toArray().join('');
    
    this.setRotationMatrix(new Matrix4());
  }

  /**
   * Check if the point is a main corner in the 4D space.
   */
  public isMainCorner(): boolean {
    const bitsSum = (
      ((this._value & BIT_MASKS.X) ? 1 : 0) +
      ((this._value & BIT_MASKS.Y) ? 1 : 0) +
      ((this._value & BIT_MASKS.Z) ? 1 : 0) +
      ((this._value & BIT_MASKS.W) ? 1 : 0)
    );
    return bitsSum % 2 === 0;
  }

  /**
   * Perform a bitwise XOR operation with the given value.
   */
  public xor(value: number): number {
    return this.value ^ value;
  }

  /**
   * Get the stereographic projection of the point as a Vector3.
   */
  public getVector3Stereographic(): Vector3 {
    const vector4d = this._vector.clone();

    const denominator = this._distance - vector4d.w;
    const projectionFactor = denominator !== 0 ? 1 / denominator : this._alternateProjectionFactor;

    const vector3d = new Vector3(vector4d.x, vector4d.y, vector4d.z)
      .multiplyScalar(projectionFactor)
      .multiplyScalar(this._scalingFactor );

    return vector3d;
  }

  /**
   * Rotate the point around the w-axis.
   */
  public rotate(): void {
    this._vector.applyMatrix4(this._rotationMatrix4D);
  }

  /**
   * Initialize the 4D rotation matrix for the w-axis rotation.
   */
  public setRotationMatrix(rotationMatrix:Matrix4): void {
    this._vector = this._orgVector.clone();

    const rotationMatrix4D = new Matrix4();
    rotationMatrix4D.multiply(rotationMatrix);

    this._rotationMatrix4D = rotationMatrix4D;
  }
}