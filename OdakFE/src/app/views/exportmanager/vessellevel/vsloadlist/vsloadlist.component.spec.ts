import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsloadlistComponent } from './vsloadlist.component';

describe('VsloadlistComponent', () => {
  let component: VsloadlistComponent;
  let fixture: ComponentFixture<VsloadlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsloadlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsloadlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
