import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotmanagementComponent } from './slotmanagement.component';

describe('SlotmanagementComponent', () => {
  let component: SlotmanagementComponent;
  let fixture: ComponentFixture<SlotmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
