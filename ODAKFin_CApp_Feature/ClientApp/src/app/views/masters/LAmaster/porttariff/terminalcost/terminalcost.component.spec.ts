import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalcostComponent } from './terminalcost.component';

describe('TerminalcostComponent', () => {
  let component: TerminalcostComponent;
  let fixture: ComponentFixture<TerminalcostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalcostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
