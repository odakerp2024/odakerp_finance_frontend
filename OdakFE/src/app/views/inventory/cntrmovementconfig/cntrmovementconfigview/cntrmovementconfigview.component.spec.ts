import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CntrmovementconfigviewComponent } from './cntrmovementconfigview.component';

describe('CntrmovementconfigviewComponent', () => {
  let component: CntrmovementconfigviewComponent;
  let fixture: ComponentFixture<CntrmovementconfigviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CntrmovementconfigviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CntrmovementconfigviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
