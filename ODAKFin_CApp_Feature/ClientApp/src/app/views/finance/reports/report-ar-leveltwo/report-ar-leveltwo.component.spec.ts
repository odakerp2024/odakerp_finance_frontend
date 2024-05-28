import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportArLeveltwoComponent } from './report-ar-leveltwo.component';

describe('ReportArLeveltwoComponent', () => {
  let component: ReportArLeveltwoComponent;
  let fixture: ComponentFixture<ReportArLeveltwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportArLeveltwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportArLeveltwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
