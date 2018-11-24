import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import * as clientActions from '../client/state/client.actions';
import * as fromClient from '../client/state/client.reducer';
import { AppointmentsModel } from '../models/appointmentsModel';
import { Clients, ClientSessionDetails } from '../client/models/clientModel';

@Component({
  selector: 'pmt-calendar-event-modal',
  templateUrl: './calendar-event-modal.component.html',
  styleUrls: ['./calendar-event-modal.component.scss']
})
export class CalendarEventModalComponent {

  constructor(public dialogRef:MatDialogRef<CalendarEventModalComponent>,
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
}
