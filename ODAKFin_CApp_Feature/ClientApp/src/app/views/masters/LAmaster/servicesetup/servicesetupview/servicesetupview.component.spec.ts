import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesetupviewComponent } from './servicesetupview.component';

describe('ServicesetupviewComponent', () => {
  let component: ServicesetupviewComponent;
  let fixture: ComponentFixture<ServicesetupviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesetupviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesetupviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
