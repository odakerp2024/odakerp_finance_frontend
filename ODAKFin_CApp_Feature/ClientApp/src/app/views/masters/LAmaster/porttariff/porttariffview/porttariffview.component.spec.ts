import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PorttariffviewComponent } from './porttariffview.component';

describe('PorttariffviewComponent', () => {
  let component: PorttariffviewComponent;
  let fixture: ComponentFixture<PorttariffviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorttariffviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PorttariffviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
