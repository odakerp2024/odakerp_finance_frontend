import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorymoveComponent } from './inventorymove.component';

describe('InventorymoveComponent', () => {
  let component: InventorymoveComponent;
  let fixture: ComponentFixture<InventorymoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorymoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorymoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
