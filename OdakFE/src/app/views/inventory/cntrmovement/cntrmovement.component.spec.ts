import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CntrmovementComponent } from './cntrmovement.component';

describe('CntrmovementComponent', () => {
  let component: CntrmovementComponent;
  let fixture: ComponentFixture<CntrmovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CntrmovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CntrmovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
