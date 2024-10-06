import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { map, startWith, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'pmt-lookup-autocomplete',
  templateUrl: './lookup-autocomplete.component.html',
  styleUrls: ['./lookup-autocomplete.component.css']
})
export class LookupAutocompleteComponent implements OnInit {

  @Input() items: { id: string | number, label: string }[] = [];

  items$: Observable<{id: string | number, label: string }[]>;
  formControl: UntypedFormControl;
  form: UntypedFormGroup;

  @Output() selectionMade: EventEmitter<string | number> = new EventEmitter();

  constructor(private _fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.form = this._fb.group({
      'searchInput': new UntypedFormControl()
    });
    this.formControl = <UntypedFormControl>this.form.get('searchInput');
    this.items$ = this.formControl.valueChanges.pipe(
      map((searchString: string) => {
        if (!!searchString && typeof(searchString) === 'string') {
          return this.items.filter(item => item.label.toUpperCase().lastIndexOf(searchString.toUpperCase()) > -1);
        } else {
          return this.items;
        }
      }),
      debounceTime(500)
    );
  }

  displayFn(option): string {
    if (!!option) {
      return option.label;
    } else {
      return '';
    }
  }

}
