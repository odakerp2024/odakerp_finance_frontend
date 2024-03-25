import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CROEntryComponent } from './croentry.component';

describe('CROEntryComponent', () => {
  let component: CROEntryComponent;
  let fixture: ComponentFixture<CROEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CROEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CROEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
