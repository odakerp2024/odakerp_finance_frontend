import { TestBed } from '@angular/core/testing';

import { FNReportServiceService } from './fnreport-service.service';

describe('FNReportServiceService', () => {
  let service: FNReportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FNReportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
