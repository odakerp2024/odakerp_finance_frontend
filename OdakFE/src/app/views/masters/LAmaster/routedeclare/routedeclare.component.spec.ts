import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedeclareComponent } from './routedeclare.component';

describe('RoutedeclareComponent', () => {
  let component: RoutedeclareComponent;
  let fixture: ComponentFixture<RoutedeclareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutedeclareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutedeclareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
