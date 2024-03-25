import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartaccountsComponent } from './chartaccounts.component';

describe('ChartaccountsComponent', () => {
  let component: ChartaccountsComponent;
  let fixture: ComponentFixture<ChartaccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartaccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartaccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
