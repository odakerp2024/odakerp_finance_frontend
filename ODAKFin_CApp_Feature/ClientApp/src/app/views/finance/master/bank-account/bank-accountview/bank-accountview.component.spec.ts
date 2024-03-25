import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountviewComponent } from './bank-accountview.component';

describe('BankAccountviewComponent', () => {
  let component: BankAccountviewComponent;
  let fixture: ComponentFixture<BankAccountviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
