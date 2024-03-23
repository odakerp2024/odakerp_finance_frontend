import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesclauseviewComponent } from './notesclauseview.component';

describe('NotesclauseviewComponent', () => {
  let component: NotesclauseviewComponent;
  let fixture: ComponentFixture<NotesclauseviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesclauseviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesclauseviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
