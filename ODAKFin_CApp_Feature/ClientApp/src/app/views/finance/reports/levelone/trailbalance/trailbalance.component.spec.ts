import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailbalanceComponent } from './trailbalance.component';

describe('TrailbalanceComponent', () => {
  let component: TrailbalanceComponent;
  let fixture: ComponentFixture<TrailbalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailbalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
