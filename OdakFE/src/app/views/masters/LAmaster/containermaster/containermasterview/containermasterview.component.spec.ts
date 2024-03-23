import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainermasterviewComponent } from './containermasterview.component';

describe('ContainermasterviewComponent', () => {
  let component: ContainermasterviewComponent;
  let fixture: ComponentFixture<ContainermasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainermasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainermasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
