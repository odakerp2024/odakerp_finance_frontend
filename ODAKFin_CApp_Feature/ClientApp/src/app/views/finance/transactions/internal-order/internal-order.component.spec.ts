import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalOrderComponent } from './internal-order.component';

describe('InternalOrderComponent', () => {
  let component: InternalOrderComponent;
  let fixture: ComponentFixture<InternalOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
