import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromClient from './state/index';
import * as clientActions from './state/client.actions';
import { ClientState } from './state/client.reducer';
import { Clients } from './models/clientModel';
import { takeWhile } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'pmt-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, OnDestroy {

  constructor(
              private _route:ActivatedRoute,
              private _router:Router,
              private _builder:FormBuilder,
              private _store:Store<ClientState>) { }

  currentClient:Clients;
  isActive:boolean;
  clientDetailsGroup:FormGroup;
  isNew: boolean;

  ngOnInit() {
    this.isActive = true;
    const id = +this._route.snapshot.paramMap.get('id');
    this.isNew = id > -1 ? false : true;
    if (this.isNew) {
      this.loadClient();
    }
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
    else {
      this.clientDetailsGroup = this._builder.group({
        'clientName': '',
        'clientSSN': '',
        'clientDoB': '',
        'clientEmail': '',
        'clientSecEmail': '',
        'clientPhone': '',
        'clientSecPhone': '',
        'clientAddress': '',
        'clientCity': '',
        'clientState': '',
        'clientZip': ''
      });
    }
  }

  save() {
    this.currentClient = {
      GeneralDetails: {
        'ClientName': this.clientDetailsGroup.value.clientName,
        'ClientSSN': this.clientDetailsGroup.value.clientSSN,
        'ClientDoB': this.clientDetailsGroup.value.clientDoB,
        'ClientAddress': this.clientDetailsGroup.value.clientAddress,
        'ClientCity': this.clientDetailsGroup.value.clientCity,
        'ClientState': this.clientDetailsGroup.value.clientState,
        'ClientZip': this.clientDetailsGroup.value.clientZip,
        'ClientEmail': this.clientDetailsGroup.value.clientEmail,
        'ClientID': this.currentClient.GeneralDetails.ClientID,
        'ClientPhone': this.clientDetailsGroup.value.clientPhone,
        'ClientSecondaryEmail': this.clientDetailsGroup.value.clientSecEmail,
        'ClientSecondaryPhone': this.clientDetailsGroup.value.clientSecPhone,
        'ClientLastName': this.currentClient.GeneralDetails.ClientLastName
      }
    };
    if (this.isNew){

    }
    else {
      this._store.dispatch(new clientActions.UpdateClient(this.currentClient));
    }
    this._router.navigate(['']);
  }
}