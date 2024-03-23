import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptvoucherslistComponent } from './receiptvoucherslist.component';

describe('ReceiptvoucherslistComponent', () => {
  let component: ReceiptvoucherslistComponent;
  let fixture: ComponentFixture<ReceiptvoucherslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptvoucherslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptvoucherslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
