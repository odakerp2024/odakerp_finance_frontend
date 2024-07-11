import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TDSPayableComponent } from './tdspayable.component';

describe('TDSPayableComponent', () => {
  let component: TDSPayableComponent;
  let fixture: ComponentFixture<TDSPayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TDSPayableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TDSPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
