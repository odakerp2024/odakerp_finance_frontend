import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailconfigviewComponent } from './emailconfigview.component';

describe('EmailconfigviewComponent', () => {
  let component: EmailconfigviewComponent;
  let fixture: ComponentFixture<EmailconfigviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailconfigviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailconfigviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
