import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorviewComponent } from './vendorview.component';

describe('VendorviewComponent', () => {
  let component: VendorviewComponent;
  let fixture: ComponentFixture<VendorviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
