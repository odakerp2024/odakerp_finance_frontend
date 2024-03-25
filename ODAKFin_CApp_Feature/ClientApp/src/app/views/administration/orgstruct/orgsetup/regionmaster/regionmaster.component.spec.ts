import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionmasterComponent } from './regionmaster.component';

describe('RegionmasterComponent', () => {
  let component: RegionmasterComponent;
  let fixture: ComponentFixture<RegionmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
