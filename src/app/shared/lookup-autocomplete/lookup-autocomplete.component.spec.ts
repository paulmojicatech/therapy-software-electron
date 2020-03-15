import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupAutocompleteComponent } from './lookup-autocomplete.component';

describe('LookupAutocompleteComponent', () => {
  let component: LookupAutocompleteComponent;
  let fixture: ComponentFixture<LookupAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
