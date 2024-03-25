import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxgroupviewComponent } from './taxgroupview.component';

describe('TaxgroupviewComponent', () => {
  let component: TaxgroupviewComponent;
  let fixture: ComponentFixture<TaxgroupviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxgroupviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxgroupviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
