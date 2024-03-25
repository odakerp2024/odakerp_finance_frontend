import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CntrpickupdropComponent } from './cntrpickupdrop.component';

describe('CntrpickupdropComponent', () => {
  let component: CntrpickupdropComponent;
  let fixture: ComponentFixture<CntrpickupdropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CntrpickupdropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CntrpickupdropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
