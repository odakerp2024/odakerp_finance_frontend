import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargecodeviewComponent } from './chargecodeview.component';

describe('ChargecodeviewComponent', () => {
  let component: ChargecodeviewComponent;
  let fixture: ComponentFixture<ChargecodeviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargecodeviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargecodeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
