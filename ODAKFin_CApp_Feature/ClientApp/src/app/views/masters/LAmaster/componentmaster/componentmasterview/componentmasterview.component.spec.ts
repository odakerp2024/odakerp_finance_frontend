import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentmasterviewComponent } from './componentmasterview.component';

describe('ComponentmasterviewComponent', () => {
  let component: ComponentmasterviewComponent;
  let fixture: ComponentFixture<ComponentmasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentmasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentmasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
