import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AppointmentsModel } from '../models/appointmentsModel';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material';
import { InputModalComponent } from './input-modal.component';
import { Clients } from '../client/models/clientModel';
import { Store, select } from '@ngrx/store';
import { State } from '../state/app.state';
import * as clientActions from '../client/state/client.actions';
import * as fromClient from '../client/state/index';
import { concatMap, tap } from 'rxjs/operators';

@Component({
  selector: 'pmt-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarComponent implements OnInit {

  constructor(private _dialog: MatDialog, private _store: Store<State>) { }

  @Input() startDate: Date;

  private _msPerDay: number = 1000 * 60 * 60 * 24;
  endDate: Date;
  view: string;
  appointments$: Observable<AppointmentsModel[]>;
  daysToExclude: number[] = [0];  
  allClients: Clients[];

  ngOnInit(): void {
    this.load();
    this.appointments$ = this._store.pipe(
      select(fromClient.getAllClients),
      concatMap(clients => {
        this.allClients = clients;

        let appointments: AppointmentsModel[] = [];
        clients.forEach(client => {
          const sessions = client && client.ClientSessionDetails ? client.ClientSessionDetails : [];
          sessions.forEach(s => {
            if (!!s.ClientSessionID && appointments.findIndex(a => a.clientSessionId === s.ClientSessionID) === -1) {
              const apptToAdd = {
                clientName: client.GeneralDetails.ClientName,
                clientId: client.GeneralDetails.ClientID,
                clientSessionId: s.ClientSessionID,
                appointmentTime: new Date(s.ClientSessionDate),
                title: client.GeneralDetails.ClientName,
                start: new Date(s.ClientSessionDate),
                end: new Date(new Date(s.ClientSessionDate).setHours(new Date(s.ClientSessionDate).getHours() + 1)),
                color: '#f7efb2'
              };
              appointments = [...appointments, apptToAdd];
            }
        });
      });
      return of(appointments);
      })
    );
  }

  load() {
    // Default values
    this.view = 'week';
    this.loadCalendar();
  }

  changeView(view: string) {
    this.view = view;
  }

  updateView(isGoBack: boolean) {
    let updatedStartDate: Date = this.startDate;
    if (isGoBack) {
      updatedStartDate = this.addDays(updatedStartDate, -6);
    } else {
      updatedStartDate = this.addDays(updatedStartDate, 6);
    }
    this._store.dispatch(new clientActions.SetCurrentCalendarWeek(updatedStartDate));
    let dateDiff = this.getDateDiff(this.startDate, this.endDate);
    if (dateDiff < 6) {
      this.endDate = this.startDate;
      this.loadCalendar();
    }
  }

  loadCalendar() {
    if (!this.endDate) {
      this.endDate = new Date();
    }

    this.endDate = this.addDays(this.endDate, 5);
  }

  eventClicked(event: AppointmentsModel) {
    this._dialog.open(InputModalComponent, {
      data: {
        selectedEvent: event
      }
    });
  }

  hourClicked(event: AppointmentsModel) {
    this._dialog.open(InputModalComponent, {
      data: {
        loadSelectedDate: true,
        selectedDate: event,
        currentStartDate: this.startDate,
        clients: this.allClients.sort((a,b) => {
          var textA = a.GeneralDetails.ClientName.toUpperCase();
          var textB = b.GeneralDetails.ClientName.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
      }
    });

  }

  private addDays(curDate: Date, daysToAdd: number): Date {
    const updatedDate = curDate.getDate() + daysToAdd;
    return new Date(curDate.setDate(updatedDate));
    
  }

  private getDateDiff(d1: Date, d2: Date): number {
    let utc1 = Date.UTC(d1.getFullYear(), d1.getMonth() + 1, d1.getDate());
    let utc2 = Date.UTC(d2.getFullYear(), d2.getMonth() + 1, d2.getDate());
    return Math.floor((utc2 - utc1) / this._msPerDay);
  }
}