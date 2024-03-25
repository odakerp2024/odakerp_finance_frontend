import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VessellevelComponent } from './vessellevel.component';

describe('VessellevelComponent', () => {
  let component: VessellevelComponent;
  let fixture: ComponentFixture<VessellevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VessellevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VessellevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
