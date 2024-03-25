import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonmasterComponent } from './commonmaster.component';

describe('CommonmasterComponent', () => {
  let component: CommonmasterComponent;
  let fixture: ComponentFixture<CommonmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
