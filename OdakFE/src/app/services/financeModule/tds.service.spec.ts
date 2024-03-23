import { TestBed } from '@angular/core/testing';

import { TDSService } from './tds.service';

describe('TDSService', () => {
  let service: TDSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TDSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
