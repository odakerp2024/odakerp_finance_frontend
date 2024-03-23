import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalagreementComponent } from './principalagreement.component';

describe('PrincipalagreementComponent', () => {
  let component: PrincipalagreementComponent;
  let fixture: ComponentFixture<PrincipalagreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalagreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalagreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
