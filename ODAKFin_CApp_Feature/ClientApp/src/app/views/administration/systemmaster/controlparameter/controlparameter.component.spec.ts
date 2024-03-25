import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlparameterComponent } from './controlparameter.component';

describe('ControlparameterComponent', () => {
  let component: ControlparameterComponent;
  let fixture: ComponentFixture<ControlparameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlparameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlparameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
