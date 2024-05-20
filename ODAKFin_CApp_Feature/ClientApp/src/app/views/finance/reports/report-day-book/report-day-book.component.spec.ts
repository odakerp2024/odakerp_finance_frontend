import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDayBookComponent } from './report-day-book.component';

describe('ReportDayBookComponent', () => {
  let component: ReportDayBookComponent;
  let fixture: ComponentFixture<ReportDayBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDayBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDayBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
