import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoGenerateCodeComponent } from './auto-generate-code.component';

describe('AutoGenerateCodeComponent', () => {
  let component: AutoGenerateCodeComponent;
  let fixture: ComponentFixture<AutoGenerateCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoGenerateCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoGenerateCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
