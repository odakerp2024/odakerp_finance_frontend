import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotviewComponent } from './depotview.component';

describe('DepotviewComponent', () => {
  let component: DepotviewComponent;
  let fixture: ComponentFixture<DepotviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepotviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
