import { TestBed } from '@angular/core/testing';

import { BkglevelService } from './bkglevel.service';

describe('BkglevelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BkglevelService = TestBed.get(BkglevelService);
    expect(service).toBeTruthy();
  });
});
