import { TestBed } from '@angular/core/testing';

import { OpeningBalancesAssetService } from './opening-balances-asset.service';

describe('OpeningBalancesAssetService', () => {
  let service: OpeningBalancesAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpeningBalancesAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
