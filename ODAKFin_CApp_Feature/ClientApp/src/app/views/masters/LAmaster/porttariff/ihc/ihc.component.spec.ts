import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IhcComponent } from './ihc.component';

describe('IhcComponent', () => {
  let component: IhcComponent;
  let fixture: ComponentFixture<IhcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IhcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IhcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
