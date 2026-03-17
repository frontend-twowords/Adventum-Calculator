import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowresultComponent } from './cashflowresult.component';

describe('CashflowresultComponent', () => {
  let component: CashflowresultComponent;
  let fixture: ComponentFixture<CashflowresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
