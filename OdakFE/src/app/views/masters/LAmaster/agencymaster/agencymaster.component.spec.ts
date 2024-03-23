import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencymasterComponent } from './agencymaster.component';

describe('AgencymasterComponent', () => {
  let component: AgencymasterComponent;
  let fixture: ComponentFixture<AgencymasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencymasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
