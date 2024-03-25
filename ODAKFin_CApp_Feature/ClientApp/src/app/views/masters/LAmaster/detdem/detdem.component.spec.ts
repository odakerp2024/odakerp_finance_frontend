import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetdemComponent } from './detdem.component';

describe('DetdemComponent', () => {
  let component: DetdemComponent;
  let fixture: ComponentFixture<DetdemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetdemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetdemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
