import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadlistComponent } from './loadlist.component';

describe('LoadlistComponent', () => {
  let component: LoadlistComponent;
  let fixture: ComponentFixture<LoadlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
