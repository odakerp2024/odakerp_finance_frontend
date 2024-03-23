import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IHChaulageComponent } from './ihchaulage.component';

describe('IHChaulageComponent', () => {
  let component: IHChaulageComponent;
  let fixture: ComponentFixture<IHChaulageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IHChaulageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IHChaulageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
