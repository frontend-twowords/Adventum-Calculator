import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtedresultComponent } from './atedresult.component';

describe('AtedresultComponent', () => {
  let component: AtedresultComponent;
  let fixture: ComponentFixture<AtedresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtedresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtedresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
