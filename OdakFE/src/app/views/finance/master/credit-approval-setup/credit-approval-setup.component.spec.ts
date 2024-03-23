import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditApprovalSetupComponent } from './credit-approval-setup.component';

describe('CreditApprovalSetupComponent', () => {
  let component: CreditApprovalSetupComponent;
  let fixture: ComponentFixture<CreditApprovalSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditApprovalSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditApprovalSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
