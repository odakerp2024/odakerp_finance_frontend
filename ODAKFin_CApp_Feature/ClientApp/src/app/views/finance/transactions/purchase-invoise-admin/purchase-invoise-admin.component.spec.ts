import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoiseAdminComponent } from './purchase-invoise-admin.component';

describe('PurchaseInvoiseAdminComponent', () => {
  let component: PurchaseInvoiseAdminComponent;
  let fixture: ComponentFixture<PurchaseInvoiseAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseInvoiseAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseInvoiseAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
