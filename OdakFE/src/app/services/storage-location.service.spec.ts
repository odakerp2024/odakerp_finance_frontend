import { TestBed } from '@angular/core/testing';

import { StorageLocationService } from './storage-location.service';

describe('StorageLocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageLocationService = TestBed.get(StorageLocationService);
    expect(service).toBeTruthy();
  });
});
