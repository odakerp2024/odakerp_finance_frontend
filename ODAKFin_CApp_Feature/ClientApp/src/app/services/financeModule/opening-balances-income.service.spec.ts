import { TestBed } from '@angular/core/testing';

import { OpeningBalancesIncomeService } from './opening-balances-income.service';

describe('OpeningBalancesIncomeService', () => {
  let service: OpeningBalancesIncomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpeningBalancesIncomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
