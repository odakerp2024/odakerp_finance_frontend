import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraInfoComponent } from './contra-info.component';

describe('ContraInfoComponent', () => {
  let component: ContraInfoComponent;
  let fixture: ComponentFixture<ContraInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContraInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContraInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
