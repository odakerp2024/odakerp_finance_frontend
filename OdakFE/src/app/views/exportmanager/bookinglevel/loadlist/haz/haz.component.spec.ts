import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HazComponent } from './haz.component';

describe('HazComponent', () => {
  let component: HazComponent;
  let fixture: ComponentFixture<HazComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HazComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
