import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceprofileviewComponent } from './instanceprofileview.component';

describe('InstanceprofileviewComponent', () => {
  let component: InstanceprofileviewComponent;
  let fixture: ComponentFixture<InstanceprofileviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceprofileviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceprofileviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
