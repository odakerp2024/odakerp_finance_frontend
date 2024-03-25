import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartaccountcodelistComponent } from './chartaccountcodelist.component';

describe('ChartaccountcodelistComponent', () => {
  let component: ChartaccountcodelistComponent;
  let fixture: ComponentFixture<ChartaccountcodelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartaccountcodelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartaccountcodelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
