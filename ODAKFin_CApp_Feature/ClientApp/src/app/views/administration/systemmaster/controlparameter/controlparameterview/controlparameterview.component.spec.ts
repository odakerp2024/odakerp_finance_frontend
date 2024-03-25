import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlparameterviewComponent } from './controlparameterview.component';

describe('ControlparameterviewComponent', () => {
  let component: ControlparameterviewComponent;
  let fixture: ComponentFixture<ControlparameterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlparameterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlparameterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
