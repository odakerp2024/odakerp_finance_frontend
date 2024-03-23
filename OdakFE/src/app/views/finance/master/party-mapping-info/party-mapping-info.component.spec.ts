import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyMappingInfoComponent } from './party-mapping-info.component';

describe('PartyMappingInfoComponent', () => {
  let component: PartyMappingInfoComponent;
  let fixture: ComponentFixture<PartyMappingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyMappingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyMappingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
