import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartaccountcodeviewComponent } from './chartaccountcodeview.component';

describe('ChartaccountcodeviewComponent', () => {
  let component: ChartaccountcodeviewComponent;
  let fixture: ComponentFixture<ChartaccountcodeviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartaccountcodeviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartaccountcodeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
