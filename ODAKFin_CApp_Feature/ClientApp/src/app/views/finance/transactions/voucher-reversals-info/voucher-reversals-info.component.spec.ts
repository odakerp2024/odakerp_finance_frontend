import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherReversalsInfoComponent } from './voucher-reversals-info.component';

describe('VoucherReversalsInfoComponent', () => {
  let component: VoucherReversalsInfoComponent;
  let fixture: ComponentFixture<VoucherReversalsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherReversalsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherReversalsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
