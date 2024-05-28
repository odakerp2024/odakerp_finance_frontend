import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportApLeveloneComponent } from './report-ap-levelone.component';

describe('ReportApLeveloneComponent', () => {
  let component: ReportApLeveloneComponent;
  let fixture: ComponentFixture<ReportApLeveloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportApLeveloneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportApLeveloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
