import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatereceiptvouchersComponent } from './createreceiptvouchers.component';

describe('CreatereceiptvouchersComponent', () => {
  let component: CreatereceiptvouchersComponent;
  let fixture: ComponentFixture<CreatereceiptvouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatereceiptvouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatereceiptvouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
