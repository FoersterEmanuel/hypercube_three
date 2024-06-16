import { Injectable } from '@angular/core';
import { PredefinedObjectsNameList, PredefinedObjectsTypeList, predefinedObjectsList } from '../data/PredefinedObjects';
import { Observable, Subject } from 'rxjs';
import { RotationMatrixs, RotationPlane } from '../class/RotationMatrix';


export type PredefinedObjectsList_Msg = PredefinedObjectsNameList;
export type Rotate_Msg = null;

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  private predefinedObjectsList = predefinedObjectsList;
  private rotationMatrixs = new RotationMatrixs();

  private predefinedObjectsList_Change = new Subject<PredefinedObjectsList_Msg>();
  predefinedObjectsList_Change$: Observable<PredefinedObjectsList_Msg> = this.predefinedObjectsList_Change.asObservable();
  private emitPredefinedObjectsList_Change(data: PredefinedObjectsList_Msg) { this.predefinedObjectsList_Change.next(data); }

  private rotate_Change = new Subject<Rotate_Msg>();
  rotate_Change$: Observable<Rotate_Msg> = this.rotate_Change.asObservable();
  private emitRotate_Change(data: Rotate_Msg) { this.rotate_Change.next(data); }

  public getPredefinedObjects_names() {
    return this.predefinedObjectsList.list.map((object: { name: PredefinedObjectsNameList; }) => object.name)
  }
  public getPredefinedObjects_NameTypeMap() {
    return this.predefinedObjectsList.list.reduce((acc, object) => {
      const name: PredefinedObjectsNameList = object.name;
      const type: PredefinedObjectsTypeList = object.type;

      if (!acc.has(type))
        acc.set(type, [name]);
      else
        acc.get(type)?.push(name);

      return acc;
    }, new Map<PredefinedObjectsTypeList, PredefinedObjectsNameList[]>())
  }
  public setDrawPredefinedObject = (name: PredefinedObjectsNameList, value: boolean) => {
    this.predefinedObjectsList.setDraw(name, value);
    this.emitPredefinedObjectsList_Change(name);
  };
  public getPredefinedObject(name: PredefinedObjectsNameList) {
    return this.predefinedObjectsList.getPredefinedObject(name);
  }

  public getRotationPlaneNames() {
    return this.rotationMatrixs.planeNames;
  }

  public setRotateRotationPlane(name: RotationPlane, value: boolean) {
    this.rotationMatrixs.setRotation(name, value);
    const rotationMatrix = this.rotationMatrixs.getFullRotationMatrix(0.01);

    this.predefinedObjectsList.list.forEach(object => {
      if (Array.isArray(object.object)) {
        object.object.forEach(shapeObject => {
          shapeObject.setRotationMatrix(rotationMatrix);
        });
      } else {
        object.object.setRotationMatrix(rotationMatrix)
      }
    });
    this.emitRotate_Change(null);
  }
}
