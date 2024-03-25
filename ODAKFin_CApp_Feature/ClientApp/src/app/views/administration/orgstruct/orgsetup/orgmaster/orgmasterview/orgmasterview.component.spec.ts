import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgmasterviewComponent } from './orgmasterview.component';

describe('OrgmasterviewComponent', () => {
  let component: OrgmasterviewComponent;
  let fixture: ComponentFixture<OrgmasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgmasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgmasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
