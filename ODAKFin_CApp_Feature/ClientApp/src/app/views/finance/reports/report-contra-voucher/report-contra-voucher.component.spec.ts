import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportContraVoucherComponent } from './report-contra-voucher.component';

describe('ReportContraVoucherComponent', () => {
  let component: ReportContraVoucherComponent;
  let fixture: ComponentFixture<ReportContraVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportContraVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportContraVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
