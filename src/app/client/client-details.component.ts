import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromClient from './state/index';
import { ClientState } from './state/client.reducer';
import { Clients } from './models/clientModel';
import { takeWhile, first } from 'rxjs/operators';
import { LoadClients } from './state/client.actions';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'pmt-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, OnDestroy {

  constructor(private _route:ActivatedRoute,
              private _builder:FormBuilder,
              private _store:Store<ClientState>) { }

  currentClient:Clients;
  isActive:boolean;
  clientDetailsGroup:FormGroup;

  ngOnInit() {
    this.isActive = true;
    const id = +this._route.snapshot.paramMap.get('id');
    this._store.pipe(
      select(fromClient.getAllClients),
      takeWhile(() => this.isActive)
    ).subscribe(clients => {
      const found = clients.filter(c => c.GeneralDetails.ClientID === id);
      if (found){
        this.currentClient = found[0];
        this.loadClient();
      }
    });
  }

  ngOnDestroy() {
    this.isActive = false;
  }
  loadClient() {
    if (this.currentClient){
      this.clientDetailsGroup = this._builder.group({
        'clientName': this.currentClient.GeneralDetails.ClientName,
        'clientSSN': this.currentClient.GeneralDetails.ClientSSN,
        'clientDoB': this.currentClient.GeneralDetails.ClientDoB,
        'clientEmail': this.currentClient.GeneralDetails.ClientEmail,
        'clientSecEmail': this.currentClient.GeneralDetails.ClientSecondaryEmail,
        'clientPhone': this.currentClient.GeneralDetails.ClientPhone,
        'clientSecPhone': this.currentClient.GeneralDetails.ClientSecondaryPhone,
        'clientAddress': this.currentClient.GeneralDetails.ClientAddress,
        'clientCity': this.currentClient.GeneralDetails.ClientCity,
        'clientState': this.currentClient.GeneralDetails.ClientState,
        'clientZip': this.currentClient.GeneralDetails.ClientZip
      });
    }
  }

  goBack() {
    this._route.snapshot.parent
  }  
}
