import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContravoucherlistComponent } from './contravoucherlist.component';

describe('ContravoucherlistComponent', () => {
  let component: ContravoucherlistComponent;
  let fixture: ComponentFixture<ContravoucherlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContravoucherlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContravoucherlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
