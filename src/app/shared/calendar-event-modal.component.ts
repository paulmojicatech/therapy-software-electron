import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppointmentsModel } from '../models/appointmentsModel';

@Component({
  selector: 'pmt-calendar-event-modal',
  templateUrl: './calendar-event-modal.component.html',
  styleUrls: ['./calendar-event-modal.component.scss']
})
export class CalendarEventModalComponent {

  constructor(public dialogRef:MatDialogRef<CalendarEventModalComponent>,
              @Inject(MAT_DIALOG_DATA)public data:AppointmentsModel) { }

  

}
