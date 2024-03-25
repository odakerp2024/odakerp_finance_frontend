import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppconfigviewComponent } from './appconfigview.component';

describe('AppconfigviewComponent', () => {
  let component: AppconfigviewComponent;
  let fixture: ComponentFixture<AppconfigviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppconfigviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppconfigviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
