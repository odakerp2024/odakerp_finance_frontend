import { TestBed } from '@angular/core/testing';

import { ExportbookingService } from './exportbooking.service';

describe('ExportbookingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportbookingService = TestBed.get(ExportbookingService);
    expect(service).toBeTruthy();
  });
});
