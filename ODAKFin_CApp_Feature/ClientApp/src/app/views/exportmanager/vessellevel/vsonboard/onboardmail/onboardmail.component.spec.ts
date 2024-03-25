import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardmailComponent } from './onboardmail.component';

describe('OnboardmailComponent', () => {
  let component: OnboardmailComponent;
  let fixture: ComponentFixture<OnboardmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
