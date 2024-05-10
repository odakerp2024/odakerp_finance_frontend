import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportJournalVoucherComponent } from './report-journal-voucher.component';

describe('ReportJournalVoucherComponent', () => {
  let component: ReportJournalVoucherComponent;
  let fixture: ComponentFixture<ReportJournalVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportJournalVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportJournalVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
