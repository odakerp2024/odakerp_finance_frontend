import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExphandlingdetailsComponent } from './exphandlingdetails.component';

describe('ExphandlingdetailsComponent', () => {
  let component: ExphandlingdetailsComponent;
  let fixture: ComponentFixture<ExphandlingdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExphandlingdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExphandlingdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
