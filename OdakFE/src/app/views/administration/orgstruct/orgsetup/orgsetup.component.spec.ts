import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgsetupComponent } from './orgsetup.component';

describe('OrgsetupComponent', () => {
  let component: OrgsetupComponent;
  let fixture: ComponentFixture<OrgsetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgsetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgsetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
