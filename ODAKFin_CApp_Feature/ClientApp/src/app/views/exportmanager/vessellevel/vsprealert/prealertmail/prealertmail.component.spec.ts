import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrealertmailComponent } from './prealertmail.component';

describe('PrealertmailComponent', () => {
  let component: PrealertmailComponent;
  let fixture: ComponentFixture<PrealertmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrealertmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrealertmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
