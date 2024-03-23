import { TestBed } from '@angular/core/testing';

import { LogdetailsService } from './logdetails.service';

describe('LogdetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogdetailsService = TestBed.get(LogdetailsService);
    expect(service).toBeTruthy();
  });
});
