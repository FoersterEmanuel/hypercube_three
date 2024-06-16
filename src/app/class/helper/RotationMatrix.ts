import { Matrix4 } from "three";

export type RotationPlane = 'XY' | 'XZ' | 'XW' | 'YZ' | 'YW' | 'ZW';

/** 
 * Generates a rotation matrix from a rotation plane and angle
 * @param plane The rotation plane
 * @param angle The angle in rad
 */
export default function rotationMatrix(axis: RotationPlane, angle: number): Matrix4 {
  const matrix = new Matrix4();

  // presetting 
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  const d = -Math.sin(angle);

  switch (axis) {
    case 'XY':
      matrix.set(
        c, d, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
      break;
    case 'XZ':
      matrix.set(
        c, 0, d, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
      );
      break;
    case 'XW':
      matrix.set(
        c, 0, 0, d,
        0, 1, 0, 0,
        0, 0, 1, 0,
        s, 0, 0, c
      );
      break;
    case 'YZ':
      matrix.set(
        1, 0, 0, 0,
        0, c, d, 0,
        0, s, c, 0,
        0, 0, 0, 1
      );
      break;
    case 'YW':
      matrix.set(
        1, 0, 0, 0,
        0, c, 0, d,
        0, 0, 1, 0,
        0, s, 0, c
      );
      break;
    case 'ZW':
      matrix.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, c, d,
        0, 0, s, c
      );
      break;
  }
  console.log(matrix)
  return matrix;
}