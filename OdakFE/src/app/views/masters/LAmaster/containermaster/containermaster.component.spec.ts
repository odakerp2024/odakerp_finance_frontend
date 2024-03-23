import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainermasterComponent } from './containermaster.component';

describe('ContainermasterComponent', () => {
  let component: ContainermasterComponent;
  let fixture: ComponentFixture<ContainermasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainermasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainermasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
