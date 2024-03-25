import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlreldetailsComponent } from './blreldetails.component';

describe('BlreldetailsComponent', () => {
  let component: BlreldetailsComponent;
  let fixture: ComponentFixture<BlreldetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlreldetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlreldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
