import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewDetailsComponent } from './credit-review-details.component';

describe('CreditReviewDetailsComponent', () => {
  let component: CreditReviewDetailsComponent;
  let fixture: ComponentFixture<CreditReviewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditReviewDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
