import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyMappingComponent } from './party-mapping.component';

describe('PartyMappingComponent', () => {
  let component: PartyMappingComponent;
  let fixture: ComponentFixture<PartyMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
