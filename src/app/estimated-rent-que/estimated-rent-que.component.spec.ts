import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatedRentQueComponent } from './estimated-rent-que.component';

describe('EstimatedRentQueComponent', () => {
  let component: EstimatedRentQueComponent;
  let fixture: ComponentFixture<EstimatedRentQueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimatedRentQueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimatedRentQueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
