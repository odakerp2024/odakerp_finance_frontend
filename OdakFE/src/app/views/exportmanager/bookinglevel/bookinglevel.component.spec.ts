import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookinglevelComponent } from './bookinglevel.component';

describe('BookinglevelComponent', () => {
  let component: BookinglevelComponent;
  let fixture: ComponentFixture<BookinglevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookinglevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookinglevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
