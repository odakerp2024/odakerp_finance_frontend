import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BOLComponent } from './bol.component';

describe('BOLComponent', () => {
  let component: BOLComponent;
  let fixture: ComponentFixture<BOLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BOLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BOLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
