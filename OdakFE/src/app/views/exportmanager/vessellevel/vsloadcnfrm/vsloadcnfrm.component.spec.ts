import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsloadcnfrmComponent } from './vsloadcnfrm.component';

describe('VsloadcnfrmComponent', () => {
  let component: VsloadcnfrmComponent;
  let fixture: ComponentFixture<VsloadcnfrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsloadcnfrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsloadcnfrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
