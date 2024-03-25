import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailcenterComponent } from './emailcenter.component';

describe('EmailcenterComponent', () => {
  let component: EmailcenterComponent;
  let fixture: ComponentFixture<EmailcenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailcenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
