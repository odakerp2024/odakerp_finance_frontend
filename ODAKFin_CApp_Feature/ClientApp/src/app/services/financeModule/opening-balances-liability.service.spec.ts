import { TestBed } from '@angular/core/testing';

import { OpeningBalancesLiabilityService } from './opening-balances-liability.service';

describe('OpeningBalancesLiabilityService', () => {
  let service: OpeningBalancesLiabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpeningBalancesLiabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
