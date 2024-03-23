import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlreleaseComponent } from './blrelease.component';

describe('BlreleaseComponent', () => {
  let component: BlreleaseComponent;
  let fixture: ComponentFixture<BlreleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlreleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlreleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
