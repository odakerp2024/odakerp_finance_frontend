import { TestBed } from '@angular/core/testing';

import { CntrpickdropService } from './cntrpickdrop.service';

describe('CntrpickdropService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CntrpickdropService = TestBed.get(CntrpickdropService);
    expect(service).toBeTruthy();
  });
});
