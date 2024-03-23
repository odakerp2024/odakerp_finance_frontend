import { TestBed } from '@angular/core/testing';

import { ExpbolService } from './expbol.service';

describe('ExpbolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpbolService = TestBed.get(ExpbolService);
    expect(service).toBeTruthy();
  });
});
