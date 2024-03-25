import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OogComponent } from './oog.component';

describe('OogComponent', () => {
  let component: OogComponent;
  let fixture: ComponentFixture<OogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
