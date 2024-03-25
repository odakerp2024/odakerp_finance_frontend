import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentVoucherInfoComponent } from './adjustment-voucher-info.component';

describe('AdjustmentVoucherInfoComponent', () => {
  let component: AdjustmentVoucherInfoComponent;
  let fixture: ComponentFixture<AdjustmentVoucherInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentVoucherInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentVoucherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
