import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsprealertComponent } from './vsprealert.component';

describe('VsprealertComponent', () => {
  let component: VsprealertComponent;
  let fixture: ComponentFixture<VsprealertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsprealertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsprealertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
