import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UommasterComponent } from './uommaster.component';

describe('UommasterComponent', () => {
  let component: UommasterComponent;
  let fixture: ComponentFixture<UommasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UommasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UommasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
