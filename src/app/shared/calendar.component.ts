import { Component, Input, OnInit, OnChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AppointmentsModel } from '../models/appointmentsModel';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material';
import { InputModalComponent } from './input-modal.component';
import { Clients } from '../client/models/clientModel';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pmt-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarComponent implements OnChanges {

  constructor(private _dialog: MatDialog, private _cd: ChangeDetectorRef) { }

  @Input() allClients: Clients[];

  private _msPerDay: number = 1000 * 60 * 60 * 24;
  startDate: Date;
  endDate: Date;
  view: string;
  appointments$: Observable<AppointmentsModel[]>;
  daysToExclude: number[] = [0, 6];  

  ngOnChanges(ch: any) {
    if (ch.allClients && ch.allClients.currentValue && ch.allClients.currentValue.length) {
      this.load();
      this._cd.markForCheck();
    }
  }

  load() {
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


    let appointments: AppointmentsModel[] = [];
    if (this.allClients && this.allClients.length) {
      this.allClients.map(c => {
        // check client has appointments
        const sessions = c && c.ClientSessionDetails ? c.ClientSessionDetails : [];
        sessions.forEach(s => {
          if (appointments.findIndex(a => a.clientSessionId === s.ClientSessionID) === -1) {
            const apptToAdd: AppointmentsModel = {
              clientName: c.GeneralDetails.ClientName,
              clientId: c.GeneralDetails.ClientID,
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
        clients: this.allClients.sort((a,b) => {
          var textA = a.GeneralDetails.ClientName.toUpperCase();
          var textB = b.GeneralDetails.ClientName.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
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