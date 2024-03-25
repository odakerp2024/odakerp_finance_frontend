import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsviewComponent } from './vendorsview.component';

describe('VendorsviewComponent', () => {
  let component: VendorsviewComponent;
  let fixture: ComponentFixture<VendorsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorsviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
