import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeveltwoBalanceSheetComponent } from './leveltwo-balance-sheet.component';

describe('LeveltwoBalanceSheetComponent', () => {
  let component: LeveltwoBalanceSheetComponent;
  let fixture: ComponentFixture<LeveltwoBalanceSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeveltwoBalanceSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeveltwoBalanceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
