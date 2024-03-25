import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContdetailsComponent } from './contdetails.component';

describe('ContdetailsComponent', () => {
  let component: ContdetailsComponent;
  let fixture: ComponentFixture<ContdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
