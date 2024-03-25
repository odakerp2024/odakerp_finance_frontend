import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityviewComponent } from './commodityview.component';

describe('CommodityviewComponent', () => {
  let component: CommodityviewComponent;
  let fixture: ComponentFixture<CommodityviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommodityviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommodityviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
