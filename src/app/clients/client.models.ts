/** A scheduled therapy session for a client. */
export interface Session {
  readonly id: number;
  /** ISO-8601 timestamp of the session start. */
  readonly start: string;
  readonly notes?: string;
}

export interface ClientInsurance {
  readonly companyId: number | null;
  readonly memberId: string;
  readonly companyPhone: string;
}

export interface Client {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly secondaryEmail: string;
  readonly phone: string;
  readonly secondaryPhone: string;
  readonly ssn: string;
  /** Date of birth as `yyyy-MM-dd`, or `null` when unknown. */
  readonly dateOfBirth: string | null;
  readonly address: string;
  readonly city: string;
  readonly state: string;
  readonly zip: string;
  readonly isDischarged: boolean;
  readonly dischargeReason: string | null;
  readonly insurance: ClientInsurance;
  readonly sessions: readonly Session[];
}

/** The editable portion of a client (everything except server-managed fields). */
export type ClientDraft = Omit<Client, 'id' | 'isDischarged' | 'dischargeReason' | 'sessions'>;

export interface InsuranceCompany {
  readonly id: number;
  readonly name: string;
  readonly phone: string;
}

export const DISCHARGE_REASONS = [
  'Lack of follow up',
  'Case closed',
  'Insurance',
  'Other',
] as const;

export type DischargeReason = (typeof DISCHARGE_REASONS)[number];

export interface DischargeRequest {
  readonly clientId: number;
  readonly reason: DischargeReason;
  readonly note: string;
}

export interface MassEmailRequest {
  readonly subject: string;
  readonly message: string;
  readonly clientIds: readonly number[];
  readonly isTest: boolean;
}

export const NEW_CLIENT_ID = -1;

export function emptyClientDraft(): ClientDraft {
  return {
    name: '',
    email: '',
    secondaryEmail: '',
    phone: '',
    secondaryPhone: '',
    ssn: '',
    dateOfBirth: null,
    address: '',
    city: '',
    state: '',
    zip: '',
    insurance: { companyId: null, memberId: '', companyPhone: '' },
  };
}

export function compareClientsByName(a: Client, b: Client): number {
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}
