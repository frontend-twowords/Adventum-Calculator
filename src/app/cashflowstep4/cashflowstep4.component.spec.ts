import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cashflowstep4Component } from './cashflowstep4.component';

describe('Cashflowstep4Component', () => {
  let component: Cashflowstep4Component;
  let fixture: ComponentFixture<Cashflowstep4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cashflowstep4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cashflowstep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
