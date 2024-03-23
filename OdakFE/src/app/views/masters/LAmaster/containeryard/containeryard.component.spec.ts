import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaineryardComponent } from './containeryard.component';

describe('ContaineryardComponent', () => {
  let component: ContaineryardComponent;
  let fixture: ComponentFixture<ContaineryardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContaineryardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaineryardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
