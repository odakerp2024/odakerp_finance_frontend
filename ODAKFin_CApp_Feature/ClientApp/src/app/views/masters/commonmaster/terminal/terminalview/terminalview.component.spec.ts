import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalviewComponent } from './terminalview.component';

describe('TerminalviewComponent', () => {
  let component: TerminalviewComponent;
  let fixture: ComponentFixture<TerminalviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
