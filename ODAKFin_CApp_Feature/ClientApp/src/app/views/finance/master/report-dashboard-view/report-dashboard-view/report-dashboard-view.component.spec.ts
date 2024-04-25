import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDashboardViewComponent } from './report-dashboard-view.component';

describe('ReportDashboardViewComponent', () => {
  let component: ReportDashboardViewComponent;
  let fixture: ComponentFixture<ReportDashboardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDashboardViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDashboardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
