import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingConfigurationComponent } from './aging-configuration.component';

describe('AgingConfigurationComponent', () => {
  let component: AgingConfigurationComponent;
  let fixture: ComponentFixture<AgingConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgingConfigurationComponent]
    });
    fixture = TestBed.createComponent(AgingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
