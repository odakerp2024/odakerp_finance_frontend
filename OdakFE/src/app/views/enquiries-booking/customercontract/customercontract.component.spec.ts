import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomercontractComponent } from './customercontract.component';

describe('CustomercontractComponent', () => {
  let component: CustomercontractComponent;
  let fixture: ComponentFixture<CustomercontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomercontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomercontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
