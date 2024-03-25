import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiriesviewComponent } from './enquiriesview.component';

describe('EnquiriesviewComponent', () => {
  let component: EnquiriesviewComponent;
  let fixture: ComponentFixture<EnquiriesviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiriesviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiriesviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
