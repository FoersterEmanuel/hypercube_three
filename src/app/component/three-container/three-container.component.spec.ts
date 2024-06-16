import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeContainerComponent } from './three-container.component';

describe('ThreeContainerComponent', () => {
  let component: ThreeContainerComponent;
  let fixture: ComponentFixture<ThreeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreeContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThreeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
