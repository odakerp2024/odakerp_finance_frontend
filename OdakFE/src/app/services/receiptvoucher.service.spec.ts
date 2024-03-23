import { TestBed } from '@angular/core/testing';

import { ReceiptvoucherService } from './receiptvoucher.service';

describe('ReceiptvoucherService', () => {
  let service: ReceiptvoucherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptvoucherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
