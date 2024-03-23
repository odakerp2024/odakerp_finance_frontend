import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamagemasterviewComponent } from './damagemasterview.component';

describe('DamagemasterviewComponent', () => {
  let component: DamagemasterviewComponent;
  let fixture: ComponentFixture<DamagemasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamagemasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamagemasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
