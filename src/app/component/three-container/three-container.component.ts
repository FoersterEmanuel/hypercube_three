import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import ThreeBasic from './../../class/threeBasic';
import { Point, Line, Square, Cube, Tesseract } from './../../class/basicObjects/AllObjects';
import { ControllerService } from './../../services/controller.service';
import { Subscription } from 'rxjs';
import { PredefinedObjectsNameList } from '../../data/PredefinedObjects';



@Component({
  selector: 'three-container',
  standalone: true,
  imports: [],
  template: '<div class="threeContainer" #threeContainerLeft></div><div #threeContainerRight></div>',
  styleUrl: './three-container.component.scss'
})
export class ThreeContainerComponent implements AfterViewInit, OnInit {
  @ViewChild('threeContainerLeft') ThreeContainerLeftRef!: ElementRef<HTMLDivElement>;
  @ViewChild('threeContainerRight') ThreeContainerRightRef!: ElementRef<HTMLDivElement>;
  private subscription_PredefinedObjects!: Subscription;
  private subscription_Rotation!: Subscription;

  private threeBasic = new ThreeBasic();
  private _objects: (Point | Line | Square | Cube | Tesseract)[] = [];

  constructor(private controllerService: ControllerService) { }

  ngOnInit() {
    this.initPredefinedObject();

    const predefinedObjects_names = this.controllerService.getPredefinedObjects_names();
    predefinedObjects_names.forEach((name) => {
      if (this.controllerService.getPredefinedObject(name).toDraw)
        this.addObject(name);
    })
  }

  ngAfterViewInit(): void {
    this.threeBasic.setContainerReference(this.ThreeContainerLeftRef);
    this.animation();
  }

  private animation() {
    const _this = this;

    this._objects.forEach(object => {
      object.animate();
    });

    window.requestAnimationFrame(() => _this.animation());
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.threeBasic.setSize();
  }
  ngOnDestroy() {
    this.subscription_PredefinedObjects.unsubscribe();
  }

  initPredefinedObject() {
    this.subscription_PredefinedObjects = this.controllerService.predefinedObjectsList_Change$.subscribe(msg => {
      this.addObject(msg);
    });
  };
  addObject(name: PredefinedObjectsNameList) {
    const object = this.controllerService.getPredefinedObject(name);
    const drawObject = object.object;
    if (object.toDraw && !object.isDraw) {
      if (Array.isArray(drawObject)) {
        this._objects = [...this._objects, ...drawObject];
        drawObject.forEach(object => this.threeBasic.addElement(object.object!));
      } else {
        this._objects = [...this._objects, drawObject];
        this.threeBasic.addElement(drawObject.object!);
      }
      object.isDraw = true;
    } else if (!object.toDraw && object.isDraw) {
      if (Array.isArray(drawObject)) {
        this._objects = [...this._objects, ...drawObject];
        drawObject.forEach(object => this.threeBasic.removeElement(object.object!));
      } else {
        this._objects = [...this._objects, drawObject];
        this.threeBasic.removeElement(drawObject.object!);
      }
      object.isDraw = false;
    }
  }
}
