import { TestBed } from '@angular/core/testing';

import { SacService } from './sac.service';

describe('SacService', () => {
  let service: SacService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SacService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
