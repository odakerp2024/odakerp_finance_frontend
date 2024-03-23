import { TestBed } from '@angular/core/testing';

import { CroService } from './cro.service';

describe('CroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CroService = TestBed.get(CroService);
    expect(service).toBeTruthy();
  });
});
