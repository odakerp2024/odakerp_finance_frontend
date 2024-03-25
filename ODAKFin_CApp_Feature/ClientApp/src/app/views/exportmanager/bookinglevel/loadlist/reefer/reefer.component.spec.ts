import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReeferComponent } from './reefer.component';

describe('ReeferComponent', () => {
  let component: ReeferComponent;
  let fixture: ComponentFixture<ReeferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReeferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReeferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
