import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSalesVoucherComponent } from './report-sales-voucher.component';

describe('ReportSalesVoucherComponent', () => {
  let component: ReportSalesVoucherComponent;
  let fixture: ComponentFixture<ReportSalesVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSalesVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSalesVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
