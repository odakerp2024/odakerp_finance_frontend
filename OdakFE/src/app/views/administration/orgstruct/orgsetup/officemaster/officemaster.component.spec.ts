import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficemasterComponent } from './officemaster.component';

describe('OfficemasterComponent', () => {
  let component: OfficemasterComponent;
  let fixture: ComponentFixture<OfficemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
