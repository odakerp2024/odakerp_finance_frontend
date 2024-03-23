import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipaldetailsComponent } from './principaldetails.component';

describe('PrincipaldetailsComponent', () => {
  let component: PrincipaldetailsComponent;
  let fixture: ComponentFixture<PrincipaldetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipaldetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipaldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
