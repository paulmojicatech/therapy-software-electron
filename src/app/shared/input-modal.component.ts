import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import * as clientActions from '../client/state/client.actions';
import * as fromClient from '../client/state/client.reducer';
import { AppointmentsModel } from '../models/appointmentsModel';
import { Clients, ClientSessionDetails } from '../client/models/clientModel';

@Component({
  selector: 'pmt-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss']
})
export class InputModalComponent {

  constructor(public dialogRef:MatDialogRef<InputModalComponent>,
              @Inject(MAT_DIALOG_DATA)public data:any,
              private _store:Store<fromClient.ClientState>) { }

  private currentClient:Clients;

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
    console.log('SEND EMAIL', 'SUB:' + subject + ';MSG:', message);
    this.dialogRef.close();
  }

}
