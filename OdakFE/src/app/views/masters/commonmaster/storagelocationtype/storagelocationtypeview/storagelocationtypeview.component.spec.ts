import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoragelocationtypeviewComponent } from './storagelocationtypeview.component';

describe('StoragelocationtypeviewComponent', () => {
  let component: StoragelocationtypeviewComponent;
  let fixture: ComponentFixture<StoragelocationtypeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoragelocationtypeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoragelocationtypeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
