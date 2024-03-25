import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalInfoComponent } from './internal-info.component';

describe('InternalInfoComponent', () => {
  let component: InternalInfoComponent;
  let fixture: ComponentFixture<InternalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
