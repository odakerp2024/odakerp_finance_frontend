import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoragelocationtypeComponent } from './storagelocationtype.component';

describe('StoragelocationtypeComponent', () => {
  let component: StoragelocationtypeComponent;
  let fixture: ComponentFixture<StoragelocationtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoragelocationtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoragelocationtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
