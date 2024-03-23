import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalagencyviewComponent } from './principalagencyview.component';

describe('PrincipalagencyviewComponent', () => {
  let component: PrincipalagencyviewComponent;
  let fixture: ComponentFixture<PrincipalagencyviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalagencyviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalagencyviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
