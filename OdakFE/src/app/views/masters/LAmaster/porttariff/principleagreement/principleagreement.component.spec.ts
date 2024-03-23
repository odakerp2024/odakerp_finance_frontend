import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipleagreementComponent } from './principleagreement.component';

describe('PrincipleagreementComponent', () => {
  let component: PrincipleagreementComponent;
  let fixture: ComponentFixture<PrincipleagreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipleagreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipleagreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
