import { TestBed } from '@angular/core/testing';

import { OpeningBalancesBankService } from './opening-balances-bank.service';

describe('OpeningBalancesBankService', () => {
  let service: OpeningBalancesBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpeningBalancesBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
