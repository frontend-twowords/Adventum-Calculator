import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Atedstep2Component } from './atedstep2.component';

describe('Atedstep2Component', () => {
  let component: Atedstep2Component;
  let fixture: ComponentFixture<Atedstep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Atedstep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Atedstep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
