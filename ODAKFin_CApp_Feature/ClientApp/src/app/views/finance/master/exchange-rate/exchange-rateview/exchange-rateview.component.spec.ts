import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateviewComponent } from './exchange-rateview.component';

describe('ExchangeRateviewComponent', () => {
  let component: ExchangeRateviewComponent;
  let fixture: ComponentFixture<ExchangeRateviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRateviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
