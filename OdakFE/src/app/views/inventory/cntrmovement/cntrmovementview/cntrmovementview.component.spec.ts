import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CntrmovementviewComponent } from './cntrmovementview.component';

describe('CntrmovementviewComponent', () => {
  let component: CntrmovementviewComponent;
  let fixture: ComponentFixture<CntrmovementviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CntrmovementviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CntrmovementviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
