import { Client, ClientDraft, InsuranceCompany, Session } from './client.models';

/*
 * Wire formats used by the Therapy Software API. The API uses PascalCase,
 * database-style field names; these are mapped to the app's models here so the
 * rest of the app never deals with them.
 */

export interface SessionDto {
  ClientSessionID: number;
  ClientSessionDate: string;
  ClientSessionNotes?: string | null;
}

export interface ClientDto {
  ClientID: number;
  ClientName: string;
  ClientPhone?: string | null;
  ClientEmail?: string | null;
  ClientAddress?: string | null;
  ClientCity?: string | null;
  ClientState?: string | null;
  ClientZip?: string | null;
  ClientSSN?: string | null;
  ClientDoB?: string | null;
  ClientSecondaryPhone?: string | null;
  ClientSecondaryEmail?: string | null;
  InsuranceCoID?: number | null;
  ClientInsuranceMemberID?: string | null;
  InsuranceCompanyPhone?: string | null;
  IsDischarged?: boolean | null;
  DischargeReason?: string | null;
  ClientSessions?: SessionDto[] | null;
}

/** Client fields sent to the API when creating or updating a client. */
export interface ClientDetailsDto {
  ClientID: number;
  ClientName: string;
  ClientEmail: string;
  ClientSecondaryEmail: string;
  ClientPhone: string;
  ClientSecondaryPhone: string;
  ClientSSN: string;
  ClientDoB: string | null;
  ClientAddress: string;
  ClientCity: string;
  ClientState: string;
  ClientZip: string;
  InsuranceCoID: number | null;
  ClientInsuranceMemberID: string;
  InsuranceCompanyPhone: string;
}

export interface InsuranceCompanyDto {
  InsuranceCoID: number;
  InsuranceCoName: string;
  InsuranceCoPhone?: string | null;
}

export interface AddSessionResponseDto {
  clientSessionId: number;
  clientId: number;
  newClientSession: string;
}

const ISO_DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})/;

/** Normalizes any date-ish value from the API to `yyyy-MM-dd` without timezone drift. */
export function toDateOnly(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const isoMatch = ISO_DATE_PREFIX.exec(value);
  if (isoMatch) {
    return isoMatch[1];
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${parsed.getFullYear()}-${month}-${day}`;
}

export function toIsoTimestamp(value: string): string | null {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function sessionFromDto(dto: SessionDto): Session | null {
  const start = toIsoTimestamp(dto.ClientSessionDate);
  if (dto.ClientSessionID == null || dto.ClientSessionID < 0 || start === null) {
    return null;
  }
  return { id: dto.ClientSessionID, start, notes: dto.ClientSessionNotes ?? undefined };
}

export function clientFromDto(dto: ClientDto): Client {
  const sessions = (dto.ClientSessions ?? [])
    .map(sessionFromDto)
    .filter((session): session is Session => session !== null);

  return {
    id: dto.ClientID,
    name: dto.ClientName ?? '',
    email: dto.ClientEmail ?? '',
    secondaryEmail: dto.ClientSecondaryEmail ?? '',
    phone: dto.ClientPhone ?? '',
    secondaryPhone: dto.ClientSecondaryPhone ?? '',
    ssn: dto.ClientSSN ?? '',
    dateOfBirth: toDateOnly(dto.ClientDoB),
    address: dto.ClientAddress ?? '',
    city: dto.ClientCity ?? '',
    state: dto.ClientState ?? '',
    zip: dto.ClientZip ?? '',
    isDischarged: dto.IsDischarged ?? false,
    dischargeReason: dto.DischargeReason ?? null,
    insurance: {
      companyId: dto.InsuranceCoID ?? null,
      memberId: dto.ClientInsuranceMemberID ?? '',
      companyPhone: dto.InsuranceCompanyPhone ?? '',
    },
    sessions,
  };
}

export function clientDetailsToDto(clientId: number, draft: ClientDraft): ClientDetailsDto {
  return {
    ClientID: clientId,
    ClientName: draft.name.trim(),
    ClientEmail: draft.email.trim(),
    ClientSecondaryEmail: draft.secondaryEmail.trim(),
    ClientPhone: draft.phone.trim(),
    ClientSecondaryPhone: draft.secondaryPhone.trim(),
    ClientSSN: draft.ssn.trim(),
    ClientDoB: draft.dateOfBirth,
    ClientAddress: draft.address.trim(),
    ClientCity: draft.city.trim(),
    ClientState: draft.state.trim(),
    ClientZip: draft.zip.trim(),
    InsuranceCoID: draft.insurance.companyId,
    ClientInsuranceMemberID: draft.insurance.memberId.trim(),
    InsuranceCompanyPhone: draft.insurance.companyPhone.trim(),
  };
}

export function insuranceCompanyFromDto(dto: InsuranceCompanyDto): InsuranceCompany {
  return {
    id: dto.InsuranceCoID,
    name: dto.InsuranceCoName,
    phone: dto.InsuranceCoPhone ?? '',
  };
}
