import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselviewComponent } from './vesselview.component';

describe('VesselviewComponent', () => {
  let component: VesselviewComponent;
  let fixture: ComponentFixture<VesselviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
