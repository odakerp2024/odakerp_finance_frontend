import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrealertfinalComponent } from './prealertfinal.component';

describe('PrealertfinalComponent', () => {
  let component: PrealertfinalComponent;
  let fixture: ComponentFixture<PrealertfinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrealertfinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrealertfinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
