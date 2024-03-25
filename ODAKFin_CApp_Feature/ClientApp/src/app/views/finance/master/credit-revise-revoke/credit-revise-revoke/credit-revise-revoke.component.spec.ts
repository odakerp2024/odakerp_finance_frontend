import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviseRevokeComponent } from './credit-revise-revoke.component';

describe('CreditReviseRevokeComponent', () => {
  let component: CreditReviseRevokeComponent;
  let fixture: ComponentFixture<CreditReviseRevokeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditReviseRevokeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviseRevokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
