import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolemanagmentviewComponent } from './rolemanagmentview.component';

describe('RolemanagmentviewComponent', () => {
  let component: RolemanagmentviewComponent;
  let fixture: ComponentFixture<RolemanagmentviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolemanagmentviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolemanagmentviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
