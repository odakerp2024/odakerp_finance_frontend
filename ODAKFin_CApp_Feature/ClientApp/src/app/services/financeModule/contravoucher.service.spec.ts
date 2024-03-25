import { TestBed } from '@angular/core/testing';

import { ContravoucherService } from './contravoucher.service';

describe('ContravoucherService', () => {
  let service: ContravoucherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContravoucherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
