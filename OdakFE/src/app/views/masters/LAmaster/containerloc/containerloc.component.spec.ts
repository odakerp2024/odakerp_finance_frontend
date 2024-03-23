import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerlocComponent } from './containerloc.component';

describe('ContainerlocComponent', () => {
  let component: ContainerlocComponent;
  let fixture: ComponentFixture<ContainerlocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerlocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
