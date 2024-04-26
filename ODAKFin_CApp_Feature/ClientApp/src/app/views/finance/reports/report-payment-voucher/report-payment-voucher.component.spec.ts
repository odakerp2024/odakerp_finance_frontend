import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPaymentVoucherComponent } from './report-payment-voucher.component';

describe('ReportPaymentVoucherComponent', () => {
  let component: ReportPaymentVoucherComponent;
  let fixture: ComponentFixture<ReportPaymentVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPaymentVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPaymentVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
