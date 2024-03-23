import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatemasterviewComponent } from './statemasterview.component';

describe('StatemasterviewComponent', () => {
  let component: StatemasterviewComponent;
  let fixture: ComponentFixture<StatemasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatemasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatemasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
