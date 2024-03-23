import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherReversalsComponent } from './voucher-reversals.component';

describe('VoucherReversalsComponent', () => {
  let component: VoucherReversalsComponent;
  let fixture: ComponentFixture<VoucherReversalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherReversalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherReversalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
