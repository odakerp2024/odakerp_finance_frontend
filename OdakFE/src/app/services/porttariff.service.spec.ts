import { TestBed } from '@angular/core/testing';

import { PorttariffService } from './porttariff.service';

describe('PorttariffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PorttariffService = TestBed.get(PorttariffService);
    expect(service).toBeTruthy();
  });
});
