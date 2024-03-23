import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailconfigComponent } from './emailconfig.component';

describe('EmailconfigComponent', () => {
  let component: EmailconfigComponent;
  let fixture: ComponentFixture<EmailconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
