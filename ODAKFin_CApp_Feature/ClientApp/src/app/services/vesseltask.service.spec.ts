import { TestBed } from '@angular/core/testing';

import { VesseltaskService } from './vesseltask.service';

describe('VesseltaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VesseltaskService = TestBed.get(VesseltaskService);
    expect(service).toBeTruthy();
  });
});
