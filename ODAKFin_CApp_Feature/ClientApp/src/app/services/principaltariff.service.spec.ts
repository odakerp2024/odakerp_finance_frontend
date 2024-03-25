import { TestBed } from '@angular/core/testing';

import { PrincipaltariffService } from './principaltariff.service';

describe('PrincipaltariffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrincipaltariffService = TestBed.get(PrincipaltariffService);
    expect(service).toBeTruthy();
  });
});
