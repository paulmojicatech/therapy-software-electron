import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InsuranceDetailsComponent } from './insurance-details.component';

describe('InsuranceDetailsComponent', () => {
  let component: InsuranceDetailsComponent;
  let fixture: ComponentFixture<InsuranceDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
