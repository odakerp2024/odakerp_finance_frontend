import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdrfinalComponent } from './tdrfinal.component';

describe('TdrfinalComponent', () => {
  let component: TdrfinalComponent;
  let fixture: ComponentFixture<TdrfinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdrfinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdrfinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
