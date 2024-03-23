import { TestBed } from '@angular/core/testing';

import { RateapprovalService } from './rateapproval.service';

describe('RateapprovalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RateapprovalService = TestBed.get(RateapprovalService);
    expect(service).toBeTruthy();
  });
});
