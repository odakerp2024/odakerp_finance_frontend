import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairmasterviewComponent } from './repairmasterview.component';

describe('RepairmasterviewComponent', () => {
  let component: RepairmasterviewComponent;
  let fixture: ComponentFixture<RepairmasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairmasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairmasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
