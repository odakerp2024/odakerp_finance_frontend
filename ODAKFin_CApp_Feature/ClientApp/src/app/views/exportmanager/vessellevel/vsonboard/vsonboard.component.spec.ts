import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsonboardComponent } from './vsonboard.component';

describe('VsonboardComponent', () => {
  let component: VsonboardComponent;
  let fixture: ComponentFixture<VsonboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsonboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsonboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
