import { TestBed } from '@angular/core/testing';

import { PaymentReceivableService } from './payment-receivable.service';

describe('PaymentReceivableService', () => {
  let service: PaymentReceivableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentReceivableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
