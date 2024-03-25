import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Countryview1Component } from './countryview1.component';

describe('Countryview1Component', () => {
  let component: Countryview1Component;
  let fixture: ComponentFixture<Countryview1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Countryview1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Countryview1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
