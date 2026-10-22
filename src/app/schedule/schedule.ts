import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  CalendarDatePipe,
  CalendarDayViewComponent,
  CalendarMonthViewComponent,
  CalendarNextViewDirective,
  CalendarPreviousViewDirective,
  CalendarTodayDirective,
  CalendarView,
  CalendarWeekViewComponent,
} from 'angular-calendar';
import { ClientsStore } from '../clients/clients.store';
import { InitialsPipe } from '../shared/initials.pipe';
import { AppointmentDialog, AppointmentDialogData } from './appointment-dialog/appointment-dialog';
import {
  NewAppointmentDialog,
  NewAppointmentDialogData,
} from './appointment-dialog/new-appointment-dialog';
import { Appointment, DAY_END_HOUR, DAY_START_HOUR } from './appointments';
import { ScheduleStore } from './schedule.store';

@Component({
  selector: 'pmt-schedule',
  imports: [
    DatePipe,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    CalendarDatePipe,
    CalendarDayViewComponent,
    CalendarWeekViewComponent,
    CalendarMonthViewComponent,
    CalendarNextViewDirective,
    CalendarPreviousViewDirective,
    CalendarTodayDirective,
    InitialsPipe,
  ],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Schedule {
  private readonly dialog = inject(MatDialog);
  protected readonly store = inject(ScheduleStore);
  protected readonly clients = inject(ClientsStore);

  protected readonly CalendarView = CalendarView;
  protected readonly dayStartHour = DAY_START_HOUR;
  protected readonly dayEndHour = DAY_END_HOUR;
  /** Weeks start on Monday. */
  protected readonly weekStartsOn = 1;
  protected readonly today = new Date();

  protected openAppointment(appointment: Appointment): void {
    this.dialog.open<AppointmentDialog, AppointmentDialogData>(AppointmentDialog, {
      data: { appointment },
      width: '420px',
    });
  }

  protected bookAppointment(date: Date): void {
    if (date.getTime() < Date.now() - 60 * 60_000) {
      // Ignore clicks on slots well in the past; booking history isn't supported.
      return;
    }
    this.dialog.open<NewAppointmentDialog, NewAppointmentDialogData>(NewAppointmentDialog, {
      data: { start: date },
      width: '480px',
    });
  }

  protected openDay(date: Date): void {
    this.store.setViewDate(date);
    this.store.setView(CalendarView.Day);
  }
}
