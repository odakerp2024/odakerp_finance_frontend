import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateInfoComponent } from './exchange-rate-info.component';

describe('ExchangeRateInfoComponent', () => {
  let component: ExchangeRateInfoComponent;
  let fixture: ComponentFixture<ExchangeRateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRateInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
