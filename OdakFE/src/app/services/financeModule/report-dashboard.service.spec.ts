import { TestBed } from '@angular/core/testing';

import { ReportDashboardService } from './report-dashboard.service';

describe('ReportDashboardService', () => {
  let service: ReportDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
