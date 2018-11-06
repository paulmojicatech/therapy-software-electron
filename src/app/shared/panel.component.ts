import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { State } from '../state/app.state';
import { Observable } from 'rxjs';
import { Clients } from '../client/models/clientModel';
import * as fromClient from '../client/state/index';
import * as clientActions from '../client/state/client.actions';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'pmt-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit, OnDestroy {

  constructor(private _store:Store<State>) { }

  isExpanded:boolean = false;
  filteredClients:Clients[] = [];
  allClients:Clients[] = [];
  isActive: boolean;
  
  ngOnInit() {
    this.isActive = true;
    // Subscribe to Clients
    this._store.pipe(
      select(fromClient.getAllClients),
      takeWhile(() => this.isActive)
    ).subscribe(c => {
      this.allClients = c;
      this.filteredClients = c;
    });
    // Load Clients
    this._store.dispatch(new clientActions.LoadClients());
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
}