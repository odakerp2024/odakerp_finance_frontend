import { TestBed } from '@angular/core/testing';

import { FinancialyearService } from './financialyear.service';

describe('FinancialyearService', () => {
  let service: FinancialyearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialyearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
