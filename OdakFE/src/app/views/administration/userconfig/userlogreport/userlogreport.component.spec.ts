import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlogreportComponent } from './userlogreport.component';

describe('UserlogreportComponent', () => {
  let component: UserlogreportComponent;
  let fixture: ComponentFixture<UserlogreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserlogreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserlogreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
