import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotcontractComponent } from './slotcontract.component';

describe('SlotcontractComponent', () => {
  let component: SlotcontractComponent;
  let fixture: ComponentFixture<SlotcontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotcontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
