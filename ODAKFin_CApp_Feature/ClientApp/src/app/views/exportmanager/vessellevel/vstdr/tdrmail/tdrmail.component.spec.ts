import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdrmailComponent } from './tdrmail.component';

describe('TdrmailComponent', () => {
  let component: TdrmailComponent;
  let fixture: ComponentFixture<TdrmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdrmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdrmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
