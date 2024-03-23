import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairmasterComponent } from './repairmaster.component';

describe('RepairmasterComponent', () => {
  let component: RepairmasterComponent;
  let fixture: ComponentFixture<RepairmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
