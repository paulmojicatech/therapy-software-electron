import { CalendarEvent } from "calendar-utils";

export class AppointmentsModel implements CalendarEvent {
    clientName: string;
    clientId: number;
    clientSessionId: number;
    appointmentTime: Date;
    title: string;
    start: Date;
    end: Date;
    color: any;
  }