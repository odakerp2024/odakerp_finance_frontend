import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVoucherReversalComponent } from './report-voucher-reversal.component';

describe('ReportVoucherReversalComponent', () => {
  let component: ReportVoucherReversalComponent;
  let fixture: ComponentFixture<ReportVoucherReversalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportVoucherReversalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVoucherReversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
