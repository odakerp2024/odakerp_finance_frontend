import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportApLeveltwoComponent } from './report-ap-leveltwo.component';

describe('ReportApLeveltwoComponent', () => {
  let component: ReportApLeveltwoComponent;
  let fixture: ComponentFixture<ReportApLeveltwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportApLeveltwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportApLeveltwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
