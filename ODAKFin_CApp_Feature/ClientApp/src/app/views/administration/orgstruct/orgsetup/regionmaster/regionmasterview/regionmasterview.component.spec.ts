import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionmasterviewComponent } from './regionmasterview.component';

describe('RegionmasterviewComponent', () => {
  let component: RegionmasterviewComponent;
  let fixture: ComponentFixture<RegionmasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionmasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionmasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
