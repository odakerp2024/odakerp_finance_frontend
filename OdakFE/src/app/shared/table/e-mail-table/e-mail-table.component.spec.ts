import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EMailTableComponent } from './e-mail-table.component';

describe('EMailTableComponent', () => {
  let component: EMailTableComponent;
  let fixture: ComponentFixture<EMailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EMailTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EMailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
