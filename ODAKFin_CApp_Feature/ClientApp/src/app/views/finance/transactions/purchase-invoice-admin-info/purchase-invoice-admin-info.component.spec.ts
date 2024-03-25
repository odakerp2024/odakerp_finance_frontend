import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoiceAdminInfoComponent } from './purchase-invoice-admin-info.component';

describe('PurchaseInvoiceAdminInfoComponent', () => {
  let component: PurchaseInvoiceAdminInfoComponent;
  let fixture: ComponentFixture<PurchaseInvoiceAdminInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseInvoiceAdminInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseInvoiceAdminInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
