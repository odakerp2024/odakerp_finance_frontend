import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VstdrComponent } from './vstdr.component';

describe('VstdrComponent', () => {
  let component: VstdrComponent;
  let fixture: ComponentFixture<VstdrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VstdrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VstdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
