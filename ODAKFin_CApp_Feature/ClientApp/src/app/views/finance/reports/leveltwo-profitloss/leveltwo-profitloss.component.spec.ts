import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeveltwoProfitlossComponent } from './leveltwo-profitloss.component';

describe('LeveltwoProfitlossComponent', () => {
  let component: LeveltwoProfitlossComponent;
  let fixture: ComponentFixture<LeveltwoProfitlossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeveltwoProfitlossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeveltwoProfitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
