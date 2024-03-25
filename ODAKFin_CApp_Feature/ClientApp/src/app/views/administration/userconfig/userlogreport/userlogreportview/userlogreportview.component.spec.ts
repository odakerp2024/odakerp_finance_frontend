import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlogreportviewComponent } from './userlogreportview.component';

describe('UserlogreportviewComponent', () => {
  let component: UserlogreportviewComponent;
  let fixture: ComponentFixture<UserlogreportviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserlogreportviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserlogreportviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
