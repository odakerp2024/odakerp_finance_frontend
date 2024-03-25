import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoldetailsComponent } from './boldetails.component';

describe('BoldetailsComponent', () => {
  let component: BoldetailsComponent;
  let fixture: ComponentFixture<BoldetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoldetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
