import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTInputRegisterComponent } from './gstinput-register.component';

describe('GSTInputRegisterComponent', () => {
  let component: GSTInputRegisterComponent;
  let fixture: ComponentFixture<GSTInputRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GSTInputRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GSTInputRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
