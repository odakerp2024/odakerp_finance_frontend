import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomercontractviewComponent } from './customercontractview.component';

describe('CustomercontractviewComponent', () => {
  let component: CustomercontractviewComponent;
  let fixture: ComponentFixture<CustomercontractviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomercontractviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomercontractviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
