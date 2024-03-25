import { TestBed } from '@angular/core/testing';

import { SlotmgmtService } from './slotmgmt.service';

describe('SlotmgmtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlotmgmtService = TestBed.get(SlotmgmtService);
    expect(service).toBeTruthy();
  });
});
