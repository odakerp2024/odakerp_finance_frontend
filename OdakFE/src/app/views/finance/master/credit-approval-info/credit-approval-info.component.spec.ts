import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditApprovalInfoComponent } from './credit-approval-info.component';

describe('CreditApprovalInfoComponent', () => {
  let component: CreditApprovalInfoComponent;
  let fixture: ComponentFixture<CreditApprovalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditApprovalInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditApprovalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
