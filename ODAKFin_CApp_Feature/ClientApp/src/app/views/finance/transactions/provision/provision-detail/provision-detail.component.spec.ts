import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionDetailComponent } from './provision-detail.component';

describe('ProvisionDetailComponent', () => {
  let component: ProvisionDetailComponent;
  let fixture: ComponentFixture<ProvisionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvisionDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
