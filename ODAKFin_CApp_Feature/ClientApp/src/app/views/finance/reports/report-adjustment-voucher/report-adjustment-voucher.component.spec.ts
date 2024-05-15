import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAdjustmentVoucherComponent } from './report-adjustment-voucher.component';

describe('ReportAdjustmentVoucherComponent', () => {
  let component: ReportAdjustmentVoucherComponent;
  let fixture: ComponentFixture<ReportAdjustmentVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAdjustmentVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAdjustmentVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
