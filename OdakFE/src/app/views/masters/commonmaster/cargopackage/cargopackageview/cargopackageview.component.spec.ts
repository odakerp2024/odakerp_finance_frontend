import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargopackageviewComponent } from './cargopackageview.component';

describe('CargopackageviewComponent', () => {
  let component: CargopackageviewComponent;
  let fixture: ComponentFixture<CargopackageviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargopackageviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargopackageviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
