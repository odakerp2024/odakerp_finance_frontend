import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UommasterviewComponent } from './uommasterview.component';

describe('UommasterviewComponent', () => {
  let component: UommasterviewComponent;
  let fixture: ComponentFixture<UommasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UommasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UommasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
