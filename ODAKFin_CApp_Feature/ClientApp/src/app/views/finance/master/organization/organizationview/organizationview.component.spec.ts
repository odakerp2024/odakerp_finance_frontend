import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationviewComponent } from './organizationview.component';

describe('OrganizationviewComponent', () => {
  let component: OrganizationviewComponent;
  let fixture: ComponentFixture<OrganizationviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
