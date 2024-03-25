import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCreditNotesComponent } from './vendor-credit-notes.component';

describe('VendorCreditNotesComponent', () => {
  let component: VendorCreditNotesComponent;
  let fixture: ComponentFixture<VendorCreditNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCreditNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCreditNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
