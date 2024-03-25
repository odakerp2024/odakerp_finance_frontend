import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LamasterComponent } from './lamaster.component';

describe('LamasterComponent', () => {
  let component: LamasterComponent;
  let fixture: ComponentFixture<LamasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LamasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LamasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
