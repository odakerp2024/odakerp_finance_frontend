import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalagencyComponent } from './principalagency.component';

describe('PrincipalagencyComponent', () => {
  let component: PrincipalagencyComponent;
  let fixture: ComponentFixture<PrincipalagencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalagencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalagencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
