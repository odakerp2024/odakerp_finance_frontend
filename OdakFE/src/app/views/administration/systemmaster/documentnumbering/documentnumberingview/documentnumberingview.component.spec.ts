import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentnumberingviewComponent } from './documentnumberingview.component';

describe('DocumentnumberingviewComponent', () => {
  let component: DocumentnumberingviewComponent;
  let fixture: ComponentFixture<DocumentnumberingviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentnumberingviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentnumberingviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
