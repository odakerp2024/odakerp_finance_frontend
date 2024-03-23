import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviseRevokeInfoComponent } from './credit-revise-revoke-info.component';

describe('CreditReviseRevokeInfoComponent', () => {
  let component: CreditReviseRevokeInfoComponent;
  let fixture: ComponentFixture<CreditReviseRevokeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditReviseRevokeInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviseRevokeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
