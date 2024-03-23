import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CntrmovementconfigComponent } from './cntrmovementconfig.component';

describe('CntrmovementconfigComponent', () => {
  let component: CntrmovementconfigComponent;
  let fixture: ComponentFixture<CntrmovementconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CntrmovementconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CntrmovementconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
