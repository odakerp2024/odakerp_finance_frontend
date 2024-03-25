import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertmailsComponent } from './alertmails.component';

describe('AlertmailsComponent', () => {
  let component: AlertmailsComponent;
  let fixture: ComponentFixture<AlertmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
