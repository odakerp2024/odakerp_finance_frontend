import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRatePairComponent } from './exchange-rate-pair.component';

describe('ExchangeRatePairComponent', () => {
  let component: ExchangeRatePairComponent;
  let fixture: ComponentFixture<ExchangeRatePairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRatePairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRatePairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
