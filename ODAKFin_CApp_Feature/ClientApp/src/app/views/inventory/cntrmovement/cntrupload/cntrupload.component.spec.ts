import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CntruploadComponent } from './cntrupload.component';

describe('CntruploadComponent', () => {
  let component: CntruploadComponent;
  let fixture: ComponentFixture<CntruploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CntruploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CntruploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
