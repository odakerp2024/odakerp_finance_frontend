import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPurchaseVoucherComponent } from './report-purchase-voucher.component';

describe('ReportPurchaseVoucherComponent', () => {
  let component: ReportPurchaseVoucherComponent;
  let fixture: ComponentFixture<ReportPurchaseVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPurchaseVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPurchaseVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
