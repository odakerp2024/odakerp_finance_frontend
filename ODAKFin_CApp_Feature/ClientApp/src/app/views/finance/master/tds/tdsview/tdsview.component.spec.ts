import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsviewComponent } from './tdsview.component';

describe('TdsviewComponent', () => {
  let component: TdsviewComponent;
  let fixture: ComponentFixture<TdsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdsviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
