import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportArLevelthreeComponent } from './report-ar-levelthree.component';

describe('ReportArLevelthreeComponent', () => {
  let component: ReportArLevelthreeComponent;
  let fixture: ComponentFixture<ReportArLevelthreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportArLevelthreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportArLevelthreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
