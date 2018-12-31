import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { State } from '../state/app.state';
import * as clientActions from '../client/state/client.actions';
import * as fromClient from '../client/state/index';
import { Clients, ClientSessionDetails } from '../client/models/clientModel';
import { ClientService } from '../client/services/client.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'pmt-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss']
})
export class InputModalComponent implements OnInit, OnDestroy {

  constructor(public dialogRef:MatDialogRef<InputModalComponent>,
              @Inject(MAT_DIALOG_DATA)public data:any,
              private _store:Store<State>,
              private _clientSvc:ClientService) { }

  private currentClient:Clients;
  isActive:boolean = false;
  clients:Clients[] = [];
  selectedClients:number[] = [];

  ngOnInit():void {
    if (this.data.sendEmail) {
     this.isActive = true;
     this._store.pipe(
      select(fromClient.getAllClients),
      takeWhile(() => this.isActive)
     ).subscribe(clients => {
      this.clients = clients;
      clients.forEach(c => {
        const found = this.selectedClients.filter(f => c.GeneralDetails.ClientID === f);
        if (!found || !found.length){
          this.selectedClients.push(c.GeneralDetails.ClientID);
        }
      });
     }); 
    }
  }

  ngOnDestroy():void {
    this.isActive = false;
  }

  close() {
    this.dialogRef.close();
  }
  createClientSession(){
    this._store.dispatch(new clientActions.AddClientAppointment(this.currentClient));
    this.dialogRef.close();
  }
  clientChanged(clientId:number) {
    let newClient:Clients[] = this.data.clients.filter(c => c.GeneralDetails.ClientID === clientId);
    if (newClient && newClient.length) {
      
      let sessions:ClientSessionDetails[] = newClient[0].ClientSessionDetails ? newClient[0].ClientSessionDetails : [];
      const selectedDate = this.data.selectedDate.date.toLocaleDateString() + ' ' + this.data.selectedDate.date.toLocaleTimeString();
      let session:ClientSessionDetails = {
        ClientSessionID: null,
        ClientSessionDate: selectedDate,
        ClientSessionNotes: ''
      };
      sessions.push(session);
      newClient[0].ClientSessionDetails = sessions;
      this.currentClient = newClient[0];
    }
  }
  deleteSession() {
    this._store.dispatch(new clientActions.DeleteClientAppointment(+this.data.selectedEvent.event.clientSessionId));
    this.dialogRef.close();
  }
  sendEmail(subject, message) {
    this._clientSvc.SendMassEmail(subject, message).subscribe(resp => {
      this.dialogRef.close();
    });
  }
  toggleClientSelected(ev, client:Clients) {
    const found = this.selectedClients.filter(c => c === client.GeneralDetails.ClientID);
    if (ev.checked){
      if (!found || !found.length){
        this.selectedClients.push(client.GeneralDetails.ClientID);
      }
    }
    else {
      if (found && found.length){
        const index = this.selectedClients.indexOf(client.GeneralDetails.ClientID);
        this.selectedClients.splice(index, 1);
      }
    }
  }
  toggleSelectAll(ev) {
    this.selectedClients = [];
    if (ev.checked) {
      this.clients.forEach(c => {
        this.selectedClients.push(c.GeneralDetails.ClientID);
      });
    }
  }
  isChecked(client:Clients) {
    const found = this.selectedClients.filter(c => c === client.GeneralDetails.ClientID);
    return found && found.length;
  }

}
