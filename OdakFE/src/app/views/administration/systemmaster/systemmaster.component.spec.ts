import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemmasterComponent } from './systemmaster.component';

describe('SystemmasterComponent', () => {
  let component: SystemmasterComponent;
  let fixture: ComponentFixture<SystemmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
