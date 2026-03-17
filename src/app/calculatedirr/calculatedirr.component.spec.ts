import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatedirrComponent } from './calculatedirr.component';

describe('CalculatedirrComponent', () => {
  let component: CalculatedirrComponent;
  let fixture: ComponentFixture<CalculatedirrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatedirrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatedirrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
