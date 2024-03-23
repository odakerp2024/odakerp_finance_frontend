import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadlistmailComponent } from './loadlistmail.component';

describe('LoadlistmailComponent', () => {
  let component: LoadlistmailComponent;
  let fixture: ComponentFixture<LoadlistmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadlistmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadlistmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
