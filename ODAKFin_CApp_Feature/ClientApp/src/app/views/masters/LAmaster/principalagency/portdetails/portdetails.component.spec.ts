import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortdetailsComponent } from './portdetails.component';

describe('PortdetailsComponent', () => {
  let component: PortdetailsComponent;
  let fixture: ComponentFixture<PortdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
