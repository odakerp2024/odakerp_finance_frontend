import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmasterviewComponent } from './salesmasterview.component';

describe('SalesmasterviewComponent', () => {
  let component: SalesmasterviewComponent;
  let fixture: ComponentFixture<SalesmasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesmasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
