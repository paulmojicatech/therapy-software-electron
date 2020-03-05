import { Component, Input, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Clients } from '../client/models/clientModel';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';


@Component({
  selector: 'pmt-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelComponent implements OnInit, OnChanges {
  constructor(private _router:Router) { }

  @Input() allClients:Clients[];

  isExpanded:boolean = false;
  filteredClients$:Observable<Clients[]>;
  form: FormGroup;
  formControl: FormControl;
  
  ngOnInit(): void {
    this.form = new FormGroup({
      'searchInput': new FormControl()
    });
    this.formControl = <FormControl>this.form.get('searchInput');
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
    )
  }

  ngOnChanges(ch: any) {
    this.allClients = ch.allClients.currentValue;
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
}