import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThreeContainerComponent } from "./component/three-container/three-container.component";
import { MenuComponent } from './component/menu/menu.component';
import { ExplanationComponent } from './component/explanation/explanation.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, ThreeContainerComponent,MenuComponent,ExplanationComponent]
})
export class AppComponent {}
