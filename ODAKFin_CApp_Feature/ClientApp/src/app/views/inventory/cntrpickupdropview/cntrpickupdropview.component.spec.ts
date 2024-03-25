import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CntrpickupdropviewComponent } from './cntrpickupdropview.component';

describe('CntrpickupdropviewComponent', () => {
  let component: CntrpickupdropviewComponent;
  let fixture: ComponentFixture<CntrpickupdropviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CntrpickupdropviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CntrpickupdropviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
