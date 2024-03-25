import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationviewComponent } from './notificationview.component';

describe('NotificationviewComponent', () => {
  let component: NotificationviewComponent;
  let fixture: ComponentFixture<NotificationviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
