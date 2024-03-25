import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCreditNotesInfoComponent } from './vendor-credit-notes-info.component';

describe('VendorCreditNotesInfoComponent', () => {
  let component: VendorCreditNotesInfoComponent;
  let fixture: ComponentFixture<VendorCreditNotesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCreditNotesInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCreditNotesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
