import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprofileviewComponent } from './userprofileview.component';

describe('UserprofileviewComponent', () => {
  let component: UserprofileviewComponent;
  let fixture: ComponentFixture<UserprofileviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserprofileviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserprofileviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
