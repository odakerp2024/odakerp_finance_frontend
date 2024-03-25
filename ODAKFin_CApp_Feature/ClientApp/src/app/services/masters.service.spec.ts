import { TestBed } from '@angular/core/testing';

import { MastersService } from './masters.service';

describe('MastersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MastersService = TestBed.get(MastersService);
    expect(service).toBeTruthy();
  });
});
