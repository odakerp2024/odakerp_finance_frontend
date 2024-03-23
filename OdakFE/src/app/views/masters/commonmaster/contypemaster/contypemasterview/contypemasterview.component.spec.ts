import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContypemasterviewComponent } from './contypemasterview.component';

describe('ContypemasterviewComponent', () => {
  let component: ContypemasterviewComponent;
  let fixture: ComponentFixture<ContypemasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContypemasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContypemasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
