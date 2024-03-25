import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContravoucherComponent } from './contravoucher.component';

describe('ContravoucherComponent', () => {
  let component: ContravoucherComponent;
  let fixture: ComponentFixture<ContravoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContravoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContravoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
