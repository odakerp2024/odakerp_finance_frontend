import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityviewComponent } from './cityview.component';

describe('CityviewComponent', () => {
  let component: CityviewComponent;
  let fixture: ComponentFixture<CityviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
