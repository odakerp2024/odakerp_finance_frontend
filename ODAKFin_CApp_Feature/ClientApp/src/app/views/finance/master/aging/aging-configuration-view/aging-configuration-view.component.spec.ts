import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingConfigurationViewComponent } from './aging-configuration-view.component';

describe('AgingConfigurationViewComponent', () => {
  let component: AgingConfigurationViewComponent;
  let fixture: ComponentFixture<AgingConfigurationViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgingConfigurationViewComponent]
    });
    fixture = TestBed.createComponent(AgingConfigurationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
