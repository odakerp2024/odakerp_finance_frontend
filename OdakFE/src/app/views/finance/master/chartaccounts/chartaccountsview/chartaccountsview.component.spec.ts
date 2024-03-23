import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartaccountsviewComponent } from './chartaccountsview.component';

describe('ChartaccountsviewComponent', () => {
  let component: ChartaccountsviewComponent;
  let fixture: ComponentFixture<ChartaccountsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartaccountsviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartaccountsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
