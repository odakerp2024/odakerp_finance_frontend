import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VessellevelviewComponent } from './vessellevelview.component';

describe('VessellevelviewComponent', () => {
  let component: VessellevelviewComponent;
  let fixture: ComponentFixture<VessellevelviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VessellevelviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VessellevelviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
