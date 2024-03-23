import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadcnfrmstsComponent } from './loadcnfrmsts.component';

describe('LoadcnfrmstsComponent', () => {
  let component: LoadcnfrmstsComponent;
  let fixture: ComponentFixture<LoadcnfrmstsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadcnfrmstsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadcnfrmstsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
