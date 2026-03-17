import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cashflowstep3Component } from './cashflowstep3.component';

describe('Cashflowstep3Component', () => {
  let component: Cashflowstep3Component;
  let fixture: ComponentFixture<Cashflowstep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cashflowstep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cashflowstep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
