import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionViewComponent } from './provision-view.component';

describe('ProvisionViewComponent', () => {
  let component: ProvisionViewComponent;
  let fixture: ComponentFixture<ProvisionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvisionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
