import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { CalendarView } from 'angular-calendar';
import { ClientsStore } from '../clients/clients.store';
import { isSameDay, toAppointments } from './appointments';

export interface ScheduleState {
  readonly view: CalendarView;
  readonly viewDate: Date;
  readonly showSunday: boolean;
}

export const ScheduleStore = signalStore(
  { providedIn: 'root' },
  withState<ScheduleState>({
    view: CalendarView.Week,
    viewDate: new Date(),
    showSunday: false,
  }),
  withComputed(() => {
    const clients = inject(ClientsStore);
    const appointments = computed(() => toAppointments(clients.clients()));
    return {
      appointments,
      todaysAppointments: computed(() => {
        const today = new Date();
        return appointments().filter((appointment) => isSameDay(appointment.start, today));
      }),
    };
  }),
  withComputed(({ showSunday }) => ({
    excludeDays: computed(() => (showSunday() ? [] : [0])),
  })),
  withMethods((store) => ({
    setView(view: CalendarView): void {
      patchState(store, { view });
    },
    setViewDate(viewDate: Date): void {
      patchState(store, { viewDate });
    },
    goToToday(): void {
      patchState(store, { viewDate: new Date() });
    },
    toggleSunday(): void {
      patchState(store, ({ showSunday }) => ({ showSunday: !showSunday }));
    },
  })),
);
