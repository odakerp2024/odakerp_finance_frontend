import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialyearviewComponent } from './financialyearview.component';

describe('FinancialyearviewComponent', () => {
  let component: FinancialyearviewComponent;
  let fixture: ComponentFixture<FinancialyearviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialyearviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialyearviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
