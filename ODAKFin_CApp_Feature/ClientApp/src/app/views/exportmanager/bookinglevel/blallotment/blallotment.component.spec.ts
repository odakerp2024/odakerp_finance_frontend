import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlallotmentComponent } from './blallotment.component';

describe('BlallotmentComponent', () => {
  let component: BlallotmentComponent;
  let fixture: ComponentFixture<BlallotmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlallotmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlallotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
