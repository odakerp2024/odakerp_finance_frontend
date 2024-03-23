import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiriesBookingComponent } from './enquiries-booking.component';

describe('EnquiriesBookingComponent', () => {
  let component: EnquiriesBookingComponent;
  let fixture: ComponentFixture<EnquiriesBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiriesBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiriesBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
