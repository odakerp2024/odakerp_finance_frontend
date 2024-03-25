import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoaNumberRangeComponent } from './coa-number-range.component';

describe('CoaNumberRangeComponent', () => {
  let component: CoaNumberRangeComponent;
  let fixture: ComponentFixture<CoaNumberRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoaNumberRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoaNumberRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
