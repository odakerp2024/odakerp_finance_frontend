import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceMasterComponent } from './financemaster.component';

describe('MasterComponent', () => {
  let component: FinanceMasterComponent;
  let fixture: ComponentFixture<FinanceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
