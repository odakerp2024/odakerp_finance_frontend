import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdoComponent } from './odo.component';

describe('OdoComponent', () => {
  let component: OdoComponent;
  let fixture: ComponentFixture<OdoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
