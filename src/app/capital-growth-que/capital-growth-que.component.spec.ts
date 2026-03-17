import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalGrowthQueComponent } from './capital-growth-que.component';

describe('CapitalGrowthQueComponent', () => {
  let component: CapitalGrowthQueComponent;
  let fixture: ComponentFixture<CapitalGrowthQueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapitalGrowthQueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalGrowthQueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
