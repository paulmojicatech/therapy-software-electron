import { CalendarEvent } from 'angular-calendar';
import { Client } from '../clients/client.models';

export const SESSION_LENGTH_MINUTES = 60;
export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 21;

export interface AppointmentMeta {
  readonly clientId: number;
  readonly clientName: string;
  readonly sessionId: number;
}

export type Appointment = CalendarEvent<AppointmentMeta>;

const APPOINTMENT_COLOR = {
  primary: 'var(--mat-sys-primary)',
  secondary: 'var(--mat-sys-secondary-container)',
  secondaryText: 'var(--mat-sys-on-secondary-container)',
};

/** Flattens every client's sessions into calendar events (one event per session). */
export function toAppointments(clients: readonly Client[]): Appointment[] {
  const seen = new Set<number>();
  const appointments: Appointment[] = [];

  for (const client of clients) {
    for (const session of client.sessions) {
      if (seen.has(session.id)) {
        continue;
      }
      seen.add(session.id);
      const start = new Date(session.start);
      appointments.push({
        id: session.id,
        title: client.name,
        start,
        end: new Date(start.getTime() + SESSION_LENGTH_MINUTES * 60_000),
        color: APPOINTMENT_COLOR,
        meta: { clientId: client.id, clientName: client.name, sessionId: session.id },
      });
    }
  }
  return appointments.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
