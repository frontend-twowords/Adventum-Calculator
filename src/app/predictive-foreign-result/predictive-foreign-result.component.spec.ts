import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveForeignResultComponent } from './predictive-foreign-result.component';

describe('PredictiveForeignResultComponent', () => {
  let component: PredictiveForeignResultComponent;
  let fixture: ComponentFixture<PredictiveForeignResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictiveForeignResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveForeignResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
