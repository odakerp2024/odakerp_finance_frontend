import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewComponent } from './credit-review.component';

describe('CreditReviewComponent', () => {
  let component: CreditReviewComponent;
  let fixture: ComponentFixture<CreditReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
