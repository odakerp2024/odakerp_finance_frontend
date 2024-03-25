import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatemasterComponent } from './statemaster.component';

describe('StatemasterComponent', () => {
  let component: StatemasterComponent;
  let fixture: ComponentFixture<StatemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
