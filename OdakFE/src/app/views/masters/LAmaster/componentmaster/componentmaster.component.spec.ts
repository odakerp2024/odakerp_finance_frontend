import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentmasterComponent } from './componentmaster.component';

describe('ComponentmasterComponent', () => {
  let component: ComponentmasterComponent;
  let fixture: ComponentFixture<ComponentmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
