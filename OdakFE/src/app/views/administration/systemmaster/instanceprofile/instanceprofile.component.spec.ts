import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceprofileComponent } from './instanceprofile.component';

describe('InstanceprofileComponent', () => {
  let component: InstanceprofileComponent;
  let fixture: ComponentFixture<InstanceprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
