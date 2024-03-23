import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenconfigurationComponent } from './screenconfiguration.component';

describe('ScreenconfigurationComponent', () => {
  let component: ScreenconfigurationComponent;
  let fixture: ComponentFixture<ScreenconfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenconfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
