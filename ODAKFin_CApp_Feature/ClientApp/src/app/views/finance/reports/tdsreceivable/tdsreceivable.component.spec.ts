import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TDSReceivableComponent } from './tdsreceivable.component';

describe('TDSReceivableComponent', () => {
  let component: TDSReceivableComponent;
  let fixture: ComponentFixture<TDSReceivableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TDSReceivableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TDSReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
