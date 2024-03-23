import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVoucherviewComponent } from './payment-voucherview.component';

describe('PaymentVoucherviewComponent', () => {
  let component: PaymentVoucherviewComponent;
  let fixture: ComponentFixture<PaymentVoucherviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentVoucherviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentVoucherviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
