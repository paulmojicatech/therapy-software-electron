import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppointmentsModel } from '../models/appointmentsModel';
import { State } from '../state/app.state';
import * as fromClient from '../client/state/index';
import { Store, select } from '@ngrx/store';
import { takeWhile, map } from 'rxjs/operators';

@Component({
  selector: 'pmt-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit, OnDestroy {

  constructor(private _store:Store<State>) { }

  private _msPerDay: number = 1000 * 60 * 60 * 24;
  isLoading: boolean;
  startDate:Date;
  endDate:Date;
  view: string;
  appointments:AppointmentsModel[] = [];
  isActive:boolean;
  daysToExclude: number[] = [0, 1, 6];

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
    //this.isSelected = false;
    this.loadCalendar();
  }

  changeView(view: string) {
    this.view = view;
  }

  updateView() {
    let newEndDate = this.addDays(this.endDate, 5);
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
    
    this._store.pipe(
      select(fromClient.getAllClients),
      takeWhile(() => this.isActive)
    ).subscribe(clients => {
      clients.forEach(c => {
        // check client has appointments
        const sessions = c.SessionDetails ? c.SessionDetails : [];
        sessions.forEach(s => {
          if (this.appointments.findIndex(a => a.clientSessionId === s.ClientSessionID) !== -1) {
            const apptToAdd:AppointmentsModel = { 
              clientName: c.GeneralDetails.ClientName,
              clientSessionId: s.ClientSessionID,
              appointmentTime: new Date(s.ClientSessionDate),
              title: c.GeneralDetails.ClientName,
              start: new Date(s.ClientSessionDate),
              color: '#f7efb2'
            };
            this.appointments.push(apptToAdd);
          }
        });
      });
      this.isLoading = false;
    });

    // this._apiSvc.GetFirstAvailableAppointments(this.endDate.toDateString()).subscribe(resp => {
    //   let json: AvailableAppointments = JSON.parse(resp.json());
    //   let dates = json.AvailableDates;
    //   this.endDate = new Date(json.LastDay);
    //   if (dates) {
    //     let events: CalendarEvent[] = [];
    //     dates.map(d => {
    //       let dateInst = new Date(d);
    //       let text: string = dateInst.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    //       events.push({
    //         title: text,
    //         start: dateInst,
    //         color: { primary: '#C7EBAF', secondary: '#95C177' }
    //       });
    //     });
    //     if (this.availableAppointments) {
    //       events.map(x => {
    //         let found = this.availableAppointments.find(y => y.start.getDate() === x.start.getDate()
    //           && x.start.getHours() === y.start.getHours()
    //           && x.start.getMinutes() === y.start.getMinutes());
    //         if (!found) {
    //           this.availableAppointments = this.availableAppointments.concat(x);
    //         }
    //       });
    //     }
    //     else {
    //       this.availableAppointments = events;
    //     }
    //     // this.availableAppointments = this.availableAppointments ? 
    //     //     this.availableAppointments.concat(events) : events;
    //     this.isLoading = false;
    //   }
    // });
  }

  selectDate(selectedEvent) {
    let formattedDate = selectedEvent.event.start.toDateString() + ' ' + selectedEvent.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // this.selectedDate = formattedDate;
    // this.close();
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
