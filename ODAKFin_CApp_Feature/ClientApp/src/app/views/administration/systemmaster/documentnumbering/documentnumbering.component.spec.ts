import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentnumberingComponent } from './documentnumbering.component';

describe('DocumentnumberingComponent', () => {
  let component: DocumentnumberingComponent;
  let fixture: ComponentFixture<DocumentnumberingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentnumberingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentnumberingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
