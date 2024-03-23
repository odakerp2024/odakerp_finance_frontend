import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoyageviewComponent } from './voyageview.component';

describe('VoyageviewComponent', () => {
  let component: VoyageviewComponent;
  let fixture: ComponentFixture<VoyageviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoyageviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoyageviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
