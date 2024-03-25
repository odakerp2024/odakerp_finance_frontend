import { TestBed } from '@angular/core/testing';

import { ChargecodeService } from './chargecode.service';

describe('ChargecodeService', () => {
  let service: ChargecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
