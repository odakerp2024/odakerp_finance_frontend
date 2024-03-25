import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartymasterComponent } from './partymaster.component';

describe('PartymasterComponent', () => {
  let component: PartymasterComponent;
  let fixture: ComponentFixture<PartymasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartymasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
