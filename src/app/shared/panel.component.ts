import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { State } from '../state/app.state';
import { Clients } from '../client/models/clientModel';
import * as fromClient from '../client/state/index';
import * as clientActions from '../client/state/client.actions';
import { takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'pmt-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit, OnDestroy {

  constructor(private _store:Store<State>,
              private _router:Router) { }

  isExpanded:boolean = false;
  filteredClients:Clients[] = [];
  allClients:Clients[] = [];
  isActive: boolean;
  allClients$:Observable<Clients[]>;
  
  ngOnInit() {
    this.isActive = true;
    
    // Load Clients
    this._store.dispatch(new clientActions.LoadClients());

    // Subscribe to Clients
    this._store.pipe(
      select(fromClient.getAllClients),
      takeWhile(() => this.isActive)
    ).subscribe(c => {
      this.allClients = c;
      this.filteredClients = c;
    });
  }

  ngOnDestroy() {
    this.isActive = false;
  }

  toggleExpander() {
    this.isExpanded = !this.isExpanded;
  }

  filterClients(ev:any){
    this.filteredClients = this.allClients.filter(c => {
      return c.GeneralDetails.ClientName.toLowerCase()
        .lastIndexOf(ev.target.value.toLowerCase()) > -1;
    });
  }

  selectClient(client:Clients){
    if (client){
      this._store.dispatch(new clientActions.SetCurrentClient(client));
      this._router.navigate(['clients/' + client.GeneralDetails.ClientID]);
    }
    else {
      this._router.navigate(['clients/-1']);
    }
  }
}