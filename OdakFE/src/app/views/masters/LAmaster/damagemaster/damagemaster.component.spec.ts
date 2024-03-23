import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamagemasterComponent } from './damagemaster.component';

describe('DamagemasterComponent', () => {
  let component: DamagemasterComponent;
  let fixture: ComponentFixture<DamagemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamagemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamagemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
