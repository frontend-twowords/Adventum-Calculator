import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveForeignQueComponent } from './predictive-foreign-que.component';

describe('PredictiveForeignQueComponent', () => {
  let component: PredictiveForeignQueComponent;
  let fixture: ComponentFixture<PredictiveForeignQueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictiveForeignQueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveForeignQueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
