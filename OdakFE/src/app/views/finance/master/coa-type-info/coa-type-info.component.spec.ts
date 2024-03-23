import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoaTypeInfoComponent } from './coa-type-info.component';

describe('CoaTypeInfoComponent', () => {
  let component: CoaTypeInfoComponent;
  let fixture: ComponentFixture<CoaTypeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoaTypeInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoaTypeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
