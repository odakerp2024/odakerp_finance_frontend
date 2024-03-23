import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvdetailsComponent } from './invdetails.component';

describe('InvdetailsComponent', () => {
  let component: InvdetailsComponent;
  let fixture: ComponentFixture<InvdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
