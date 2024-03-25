import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoaTypeComponent } from './coa-type.component';

describe('CoaTypeComponent', () => {
  let component: CoaTypeComponent;
  let fixture: ComponentFixture<CoaTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoaTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoaTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
