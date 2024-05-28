import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportArLeveloneComponent } from './report-ar-levelone.component';

describe('ReportArLeveloneComponent', () => {
  let component: ReportArLeveloneComponent;
  let fixture: ComponentFixture<ReportArLeveloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportArLeveloneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportArLeveloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
