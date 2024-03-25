import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotmanagementviewComponent } from './slotmanagementview.component';

describe('SlotmanagementviewComponent', () => {
  let component: SlotmanagementviewComponent;
  let fixture: ComponentFixture<SlotmanagementviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotmanagementviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotmanagementviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
