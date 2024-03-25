import { TestBed } from '@angular/core/testing';

import { AutoCodeService } from './auto-code.service';

describe('AutoCodeService', () => {
  let service: AutoCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
