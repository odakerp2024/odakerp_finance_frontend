import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorymoveviewComponent } from './inventorymoveview.component';

describe('InventorymoveviewComponent', () => {
  let component: InventorymoveviewComponent;
  let fixture: ComponentFixture<InventorymoveviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorymoveviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorymoveviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
