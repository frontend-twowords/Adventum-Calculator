import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatordetailsComponent } from './calculatordetails.component';

describe('CalculatordetailsComponent', () => {
  let component: CalculatordetailsComponent;
  let fixture: ComponentFixture<CalculatordetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatordetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatordetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
