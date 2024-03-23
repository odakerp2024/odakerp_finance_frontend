import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgmasterComponent } from './orgmaster.component';

describe('OrgmasterComponent', () => {
  let component: OrgmasterComponent;
  let fixture: ComponentFixture<OrgmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
