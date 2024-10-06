import { Component, Input, ChangeDetectionStrategy, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Clients } from '../client/models/clientModel';
import { Observable } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'pmt-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelComponent implements AfterViewInit {
  constructor(private _router:Router) { }

  @Input() allClients:Clients[];
  @Output() emitRefresh: EventEmitter<void> = new EventEmitter<void>();

  isExpanded:boolean = false;
  filteredClients$:Observable<Clients[]>;
  form: UntypedFormGroup;
  formControl: UntypedFormControl;

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      'searchInput': new UntypedFormControl()
    });
    this.formControl = <UntypedFormControl>this.form.get('searchInput');
  }
  
  ngAfterViewInit(): void {
    this.filteredClients$ = this.formControl.valueChanges.pipe(
      startWith(''),
      map((searchString: string) => {
        console.log('search', searchString);
        if (!searchString) {
          return this.allClients;
        } else {
          return this.allClients.filter(client => client.GeneralDetails.ClientName.toUpperCase()
                                                    .lastIndexOf(searchString.toUpperCase()) > -1);
        }
      })
    );
  }

  toggleExpander() {
    this.isExpanded = !this.isExpanded;
  }

  selectClient(client:Clients){
    if (client){
      this._router.navigate(['clients/' + client.GeneralDetails.ClientID]);
    }
    else {
      this._router.navigate(['clients/-1']);
    }
  }

  refreshClients(): void {
    this.emitRefresh.emit();
  }
}