import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PorttariffComponent } from './porttariff.component';

describe('PorttariffComponent', () => {
  let component: PorttariffComponent;
  let fixture: ComponentFixture<PorttariffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorttariffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PorttariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
