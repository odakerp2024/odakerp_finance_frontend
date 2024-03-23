import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CROViewComponent } from './croview.component';

describe('CROViewComponent', () => {
  let component: CROViewComponent;
  let fixture: ComponentFixture<CROViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CROViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CROViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
