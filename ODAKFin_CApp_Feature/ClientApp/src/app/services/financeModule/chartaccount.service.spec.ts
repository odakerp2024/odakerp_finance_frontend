import { TestBed } from '@angular/core/testing';

import { ChartaccountService } from './chartaccount.service';

describe('ChartaccountService', () => {
  let service: ChartaccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartaccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
