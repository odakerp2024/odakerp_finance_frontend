import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookinglevelviewComponent } from './bookinglevelview.component';

describe('BookinglevelviewComponent', () => {
  let component: BookinglevelviewComponent;
  let fixture: ComponentFixture<BookinglevelviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookinglevelviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookinglevelviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
