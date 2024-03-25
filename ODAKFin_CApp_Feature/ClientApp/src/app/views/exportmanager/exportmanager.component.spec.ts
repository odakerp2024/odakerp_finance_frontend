import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportmanagerComponent } from './exportmanager.component';

describe('ExportmanagerComponent', () => {
  let component: ExportmanagerComponent;
  let fixture: ComponentFixture<ExportmanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportmanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
