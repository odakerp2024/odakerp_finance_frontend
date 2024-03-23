import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateapprovalsviewComponent } from './rateapprovalsview.component';

describe('RateapprovalsviewComponent', () => {
  let component: RateapprovalsviewComponent;
  let fixture: ComponentFixture<RateapprovalsviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateapprovalsviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateapprovalsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
