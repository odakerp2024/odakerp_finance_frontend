import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencymasterviewComponent } from './agencymasterview.component';

describe('AgencymasterviewComponent', () => {
  let component: AgencymasterviewComponent;
  let fixture: ComponentFixture<AgencymasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencymasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencymasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
