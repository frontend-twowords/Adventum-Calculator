import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cashflowstep2Component } from './cashflowstep2.component';

describe('Cashflowstep2Component', () => {
  let component: Cashflowstep2Component;
  let fixture: ComponentFixture<Cashflowstep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cashflowstep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cashflowstep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
