import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SACviewComponent } from './sacview.component';

describe('SACviewComponent', () => {
  let component: SACviewComponent;
  let fixture: ComponentFixture<SACviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SACviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SACviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
