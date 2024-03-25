import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartymasterviewComponent } from './partymasterview.component';

describe('PartymasterviewComponent', () => {
  let component: PartymasterviewComponent;
  let fixture: ComponentFixture<PartymasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartymasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartymasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
