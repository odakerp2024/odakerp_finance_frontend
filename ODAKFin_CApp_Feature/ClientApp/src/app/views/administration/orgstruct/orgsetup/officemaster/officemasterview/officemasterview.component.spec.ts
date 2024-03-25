import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficemasterviewComponent } from './officemasterview.component';

describe('OfficemasterviewComponent', () => {
  let component: OfficemasterviewComponent;
  let fixture: ComponentFixture<OfficemasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficemasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficemasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
