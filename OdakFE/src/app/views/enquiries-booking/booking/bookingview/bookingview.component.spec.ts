import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingviewComponent } from './bookingview.component';

describe('BookingviewComponent', () => {
  let component: BookingviewComponent;
  let fixture: ComponentFixture<BookingviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
