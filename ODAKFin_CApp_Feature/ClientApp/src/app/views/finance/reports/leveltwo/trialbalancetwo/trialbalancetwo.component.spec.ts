import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialbalancetwoComponent } from './trialbalancetwo.component';

describe('TrialbalancetwoComponent', () => {
  let component: TrialbalancetwoComponent;
  let fixture: ComponentFixture<TrialbalancetwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialbalancetwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialbalancetwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
