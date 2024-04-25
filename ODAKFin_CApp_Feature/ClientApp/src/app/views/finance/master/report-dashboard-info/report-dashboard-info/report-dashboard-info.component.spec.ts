import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDashboardInfoComponent } from './report-dashboard-info.component';

describe('ReportDashboardInfoComponent', () => {
  let component: ReportDashboardInfoComponent;
  let fixture: ComponentFixture<ReportDashboardInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDashboardInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDashboardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
