import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateapprovalsComponent } from './rateapprovals.component';

describe('RateapprovalsComponent', () => {
  let component: RateapprovalsComponent;
  let fixture: ComponentFixture<RateapprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateapprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateapprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
