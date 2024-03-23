import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerlocviewComponent } from './containerlocview.component';

describe('ContainerlocviewComponent', () => {
  let component: ContainerlocviewComponent;
  let fixture: ComponentFixture<ContainerlocviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerlocviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerlocviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
