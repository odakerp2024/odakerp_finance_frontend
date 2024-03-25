import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinercostComponent } from './linercost.component';

describe('LinercostComponent', () => {
  let component: LinercostComponent;
  let fixture: ComponentFixture<LinercostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinercostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinercostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
