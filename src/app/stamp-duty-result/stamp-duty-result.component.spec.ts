import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StampDutyResultComponent } from './stamp-duty-result.component';

describe('StampDutyResultComponent', () => {
  let component: StampDutyResultComponent;
  let fixture: ComponentFixture<StampDutyResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StampDutyResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampDutyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
