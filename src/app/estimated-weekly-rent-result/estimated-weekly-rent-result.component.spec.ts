import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatedWeeklyRentResultComponent } from './estimated-weekly-rent-result.component';

describe('EstimatedWeeklyRentResultComponent', () => {
  let component: EstimatedWeeklyRentResultComponent;
  let fixture: ComponentFixture<EstimatedWeeklyRentResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimatedWeeklyRentResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimatedWeeklyRentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
