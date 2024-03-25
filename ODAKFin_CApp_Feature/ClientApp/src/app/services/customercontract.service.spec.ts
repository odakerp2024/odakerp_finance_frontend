import { TestBed } from '@angular/core/testing';

import { CustomercontractService } from './customercontract.service';

describe('CustomercontractService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomercontractService = TestBed.get(CustomercontractService);
    expect(service).toBeTruthy();
  });
});
