import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalGrowthResultComponent } from './capital-growth-result.component';

describe('CapitalGrowthResultComponent', () => {
  let component: CapitalGrowthResultComponent;
  let fixture: ComponentFixture<CapitalGrowthResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapitalGrowthResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalGrowthResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
