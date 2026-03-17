import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StampDutyQueComponent } from './stamp-duty-que.component';

describe('StampDutyQueComponent', () => {
  let component: StampDutyQueComponent;
  let fixture: ComponentFixture<StampDutyQueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StampDutyQueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampDutyQueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
