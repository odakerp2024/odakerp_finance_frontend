import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortviewComponent } from './portview.component';

describe('PortviewComponent', () => {
  let component: PortviewComponent;
  let fixture: ComponentFixture<PortviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
