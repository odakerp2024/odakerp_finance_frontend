import { TestBed } from '@angular/core/testing';

import { PaymentBatchService } from './payment-batch.service';

describe('PaymentBatchService', () => {
  let service: PaymentBatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentBatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
