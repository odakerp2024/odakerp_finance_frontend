import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContypemasterComponent } from './contypemaster.component';

describe('ContypemasterComponent', () => {
  let component: ContypemasterComponent;
  let fixture: ComponentFixture<ContypemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContypemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContypemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
