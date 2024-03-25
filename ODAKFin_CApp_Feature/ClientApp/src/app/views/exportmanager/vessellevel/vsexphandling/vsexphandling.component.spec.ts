import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsexphandlingComponent } from './vsexphandling.component';

describe('VsexphandlingComponent', () => {
  let component: VsexphandlingComponent;
  let fixture: ComponentFixture<VsexphandlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsexphandlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsexphandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
