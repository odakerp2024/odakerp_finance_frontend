import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MnrtariffComponent } from './mnrtariff.component';

describe('MnrtariffComponent', () => {
  let component: MnrtariffComponent;
  let fixture: ComponentFixture<MnrtariffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MnrtariffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MnrtariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
