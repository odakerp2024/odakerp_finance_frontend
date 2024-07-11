import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTOutputRegisterComponent } from './gstoutput-register.component';

describe('GSTOutputRegisterComponent', () => {
  let component: GSTOutputRegisterComponent;
  let fixture: ComponentFixture<GSTOutputRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GSTOutputRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GSTOutputRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
