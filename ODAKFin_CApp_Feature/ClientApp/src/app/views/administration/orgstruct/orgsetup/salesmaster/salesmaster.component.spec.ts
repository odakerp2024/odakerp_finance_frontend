import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmasterComponent } from './salesmaster.component';

describe('SalesmasterComponent', () => {
  let component: SalesmasterComponent;
  let fixture: ComponentFixture<SalesmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
