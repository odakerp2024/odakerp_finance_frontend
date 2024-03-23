import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesetupComponent } from './servicesetup.component';

describe('ServicesetupComponent', () => {
  let component: ServicesetupComponent;
  let fixture: ComponentFixture<ServicesetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
