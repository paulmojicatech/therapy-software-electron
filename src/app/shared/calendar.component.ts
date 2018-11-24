import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppointmentsModel } from '../models/appointmentsModel';
import { State } from '../state/app.state';
import * as fromClient from '../client/state/index';
import { Store, select } from '@ngrx/store';
import { takeWhile, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { CalendarEventModalComponent } from './calendar-event-modal.component';
import { Clients } from '../client/models/clientModel';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'pmt-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit, OnDestroy {

  constructor(private _store: Store<State>,
              private _dialog: MatDialog) { }

  private _msPerDay: number = 1000 * 60 * 60 * 24;
  isLoading: boolean;
  startDate: Date;
  endDate: Date;
  view: string;
  appointments$: Observable<AppointmentsModel[]>;
  isActive: boolean;
  daysToExclude: number[] = [0, 1, 6];
  allClients: Clients[] = [];

  ngOnInit(): void {
    this.isActive = true;
    this.load();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

  load() {
    this.isLoading = true;
    // Default values
    this.startDate = new Date();
    this.view = 'week';
    this.loadCalendar();
  }

  changeView(view: string) {
    this.view = view;
  }

  updateView() {
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

    this._store.pipe(
      select(fromClient.getAllClients),
      takeWhile(() => this.isActive)
    ).subscribe(clients => {
      let appointments:AppointmentsModel[] = [];
      if (clients && clients.length) {
        this.allClients = clients;
        clients.forEach(c => {
          // check client has appointments
          const sessions = c ? c.ClientSessionDetails : [];
          sessions.forEach(s => {
            if (appointments.findIndex(a => a.clientSessionId === s.ClientSessionID) === -1) {
              const apptToAdd: AppointmentsModel = {
                clientName: c.GeneralDetails.ClientName,
                clientSessionId: s.ClientSessionID,
                appointmentTime: new Date(s.ClientSessionDate),
                title: c.GeneralDetails.ClientName,
                start: new Date(s.ClientSessionDate),
                end: new Date(new Date(s.ClientSessionDate).setHours(new Date(s.ClientSessionDate).getHours() + 1)),
                color: '#f7efb2'
              };
              appointments.push(apptToAdd);
            }
          });
        });
        this.appointments$ = of(appointments);
      }
      this.isLoading = false;
    });
  }

  eventClicked(event:AppointmentsModel){
    this._dialog.open(CalendarEventModalComponent, {
      data: {
        selectedEvent: event
      }
    });
  }

  hourClicked(event:AppointmentsModel){
    this._dialog.open(CalendarEventModalComponent, {
      data: {
        selectedDate: event,
        clients: this.allClients
      }
    });
    
    
  }

  private addDays(curDate: Date, daysToAdd: number): Date {
    return new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate() + daysToAdd);
  }

  private getDateDiff(d1: Date, d2: Date): number {
    let utc1 = Date.UTC(d1.getFullYear(), d1.getMonth() + 1, d1.getDate());
    let utc2 = Date.UTC(d2.getFullYear(), d2.getMonth() + 1, d2.getDate());
    return Math.floor((utc2 - utc1) / this._msPerDay);
  }

}
