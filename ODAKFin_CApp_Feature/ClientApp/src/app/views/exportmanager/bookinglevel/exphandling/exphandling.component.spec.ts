import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExphandlingComponent } from './exphandling.component';

describe('ExphandlingComponent', () => {
  let component: ExphandlingComponent;
  let fixture: ComponentFixture<ExphandlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExphandlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExphandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
