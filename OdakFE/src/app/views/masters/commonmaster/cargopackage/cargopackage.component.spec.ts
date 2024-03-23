import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargopackageComponent } from './cargopackage.component';

describe('CargopackageComponent', () => {
  let component: CargopackageComponent;
  let fixture: ComponentFixture<CargopackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargopackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargopackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
