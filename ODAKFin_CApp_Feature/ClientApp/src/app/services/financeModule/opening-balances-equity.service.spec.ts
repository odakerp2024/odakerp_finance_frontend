import { TestBed } from '@angular/core/testing';

import { OpeningBalancesEquityService } from './opening-balances-equity.service';

describe('OpeningBalancesEquityService', () => {
  let service: OpeningBalancesEquityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpeningBalancesEquityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
