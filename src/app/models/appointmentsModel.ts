import { CalendarEvent } from "calendar-utils";

export class AppointmentsModel implements CalendarEvent {
    clientName: string;
    clientSessionId: number;
    appointmentTime: Date;
    title: string;
    start: Date;
    end: Date;
    color: any;
  }