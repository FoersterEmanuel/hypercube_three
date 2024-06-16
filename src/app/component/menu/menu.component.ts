import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ControllerService } from '../../services/controller.service';
import { PredefinedObjectsNameList, PredefinedObjectsTypeList } from '../../data/PredefinedObjects';
import { RotationPlane } from '../../class/RotationMatrix';



@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  public selectedTab: string = 'close';

  public predefinedObjects_FormControl!: Map<PredefinedObjectsNameList, FormControl<boolean | null>>;
  public predefinedObjects_NameTypeMapArray: [PredefinedObjectsTypeList, PredefinedObjectsNameList[]][];

  public rotation_planeNames: RotationPlane[];
  public rotation_FormControl: Map<RotationPlane, FormControl<boolean | null>>;

  public description: string = '';
  public showDescription: boolean = false;

  constructor(
    private controllerService: ControllerService,
  ) {
    /* predefinedObjects */
    const predefinedObjects_names = this.controllerService.getPredefinedObjects_names();
    const predefinedObjects_NameTypeMap = this.controllerService.getPredefinedObjects_NameTypeMap();
    this.predefinedObjects_FormControl = predefinedObjects_names.reduce(
      (
        acc: Map<PredefinedObjectsNameList, FormControl<boolean | null>>,
        name: PredefinedObjectsNameList
      ) => {
        const toDraw = this.controllerService.getPredefinedObject(name).toDraw;
        acc.set(name, new FormControl(toDraw));
        return acc;
      }, new Map<PredefinedObjectsNameList, FormControl<boolean | null>>()
    );
    this.predefinedObjects_NameTypeMapArray = Array.from(predefinedObjects_NameTypeMap);


    /* rotation */
    this.rotation_planeNames = this.controllerService.getRotationPlaneNames();
    this.rotation_FormControl = this.rotation_planeNames.reduce(
      (
        acc: Map<RotationPlane, FormControl<boolean | null>>,
        name: RotationPlane
      ) => {
        acc.set(name, new FormControl(false));
        return acc;
      }, new Map<RotationPlane, FormControl<boolean | null>>());
  }

  ngOnInit() {
    this.predefinedObjects_FormControl.forEach((formControl, key) => {
      formControl.valueChanges.subscribe(checked => {
        this.controllerService.setDrawPredefinedObject(key, checked!);
      });
    });

    this.rotation_FormControl.forEach((formControl, key) => {
      formControl.valueChanges.subscribe(checked => {
        this.controllerService.setRotateRotationPlane(key, checked!);
      });
    });
  }

  setSelectedTab(selectedTab: string) {
    this.selectedTab = selectedTab;
  }

  handleHover(event: MouseEvent, isHover: boolean, name: PredefinedObjectsNameList|'') {
    if (isHover && name !== '') {
      const description = this.controllerService.getPredefinedObject(name).description;
      this.description = description;
      this.showDescription = true;
    } else {
      this.showDescription = false;
    }
  }
}
