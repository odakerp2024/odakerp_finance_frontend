import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReceiptVoucherComponent } from './report-receipt-voucher.component';

describe('ReportReceiptVoucherComponent', () => {
  let component: ReportReceiptVoucherComponent;
  let fixture: ComponentFixture<ReportReceiptVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportReceiptVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportReceiptVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
