import { Client, emptyClientDraft } from '../clients/client.models';
import { SESSION_LENGTH_MINUTES, isSameDay, toAppointments } from './appointments';

function client(id: number, name: string, sessions: Client['sessions']): Client {
  return {
    ...emptyClientDraft(),
    id,
    name,
    isDischarged: false,
    dischargeReason: null,
    sessions,
  };
}

describe('toAppointments', () => {
  it('creates one sorted event per session with a fixed length', () => {
    const appointments = toAppointments([
      client(1, 'B', [{ id: 10, start: '2026-10-21T15:00:00.000Z' }]),
      client(2, 'A', [{ id: 11, start: '2026-10-20T15:00:00.000Z' }]),
    ]);

    expect(appointments.map((a) => a.id)).toEqual([11, 10]);
    expect(appointments[0]).toMatchObject({
      title: 'A',
      meta: { clientId: 2, clientName: 'A', sessionId: 11 },
    });
    const { start, end } = appointments[0];
    expect(end!.getTime() - start.getTime()).toBe(SESSION_LENGTH_MINUTES * 60_000);
  });

  it('ignores duplicate session ids', () => {
    const session = { id: 5, start: '2026-10-20T15:00:00.000Z' };
    expect(toAppointments([client(1, 'A', [session]), client(2, 'B', [session])])).toHaveLength(1);
  });
});

describe('isSameDay', () => {
  it('compares calendar days', () => {
    expect(isSameDay(new Date(2026, 9, 22, 8), new Date(2026, 9, 22, 20))).toBe(true);
    expect(isSameDay(new Date(2026, 9, 22), new Date(2026, 9, 23))).toBe(false);
  });
});
