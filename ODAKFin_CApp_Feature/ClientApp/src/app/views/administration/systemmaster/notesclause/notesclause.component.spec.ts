import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesclauseComponent } from './notesclause.component';

describe('NotesclauseComponent', () => {
  let component: NotesclauseComponent;
  let fixture: ComponentFixture<NotesclauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesclauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesclauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
