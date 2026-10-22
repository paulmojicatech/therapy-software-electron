import {
  ClientDto,
  clientDetailsToDto,
  clientFromDto,
  insuranceCompanyFromDto,
  toDateOnly,
} from './client-api.mapper';
import { emptyClientDraft } from './client.models';

describe('client-api.mapper', () => {
  describe('toDateOnly', () => {
    it('keeps the calendar date of ISO timestamps regardless of timezone', () => {
      expect(toDateOnly('1988-04-12T00:00:00.000Z')).toBe('1988-04-12');
    });

    it('parses other date formats as local dates', () => {
      expect(toDateOnly('Apr 12, 1988')).toBe('1988-04-12');
    });

    it('returns null for empty or invalid values', () => {
      expect(toDateOnly(null)).toBeNull();
      expect(toDateOnly('')).toBeNull();
      expect(toDateOnly('not a date')).toBeNull();
    });
  });

  describe('clientFromDto', () => {
    const dto: ClientDto = {
      ClientID: 7,
      ClientName: 'Jane Doe',
      ClientEmail: 'jane@example.com',
      ClientDoB: '1990-01-02T00:00:00Z',
      InsuranceCoID: 3,
      ClientInsuranceMemberID: 'M-1',
      IsDischarged: true,
      DischargeReason: 'Insurance',
      ClientSessions: [
        { ClientSessionID: 1, ClientSessionDate: '2026-10-20T14:00:00.000Z' },
        { ClientSessionID: -1, ClientSessionDate: '2026-10-21T14:00:00.000Z' },
        { ClientSessionID: 2, ClientSessionDate: 'garbage' },
      ],
    };

    it('maps API fields to the app model with safe defaults', () => {
      const client = clientFromDto(dto);
      expect(client).toMatchObject({
        id: 7,
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '',
        dateOfBirth: '1990-01-02',
        isDischarged: true,
        dischargeReason: 'Insurance',
        insurance: { companyId: 3, memberId: 'M-1', companyPhone: '' },
      });
    });

    it('drops placeholder and unparseable sessions', () => {
      expect(clientFromDto(dto).sessions).toEqual([
        { id: 1, start: '2026-10-20T14:00:00.000Z', notes: undefined },
      ]);
    });

    it('handles a missing session list', () => {
      expect(clientFromDto({ ClientID: 1, ClientName: 'A' }).sessions).toEqual([]);
    });
  });

  it('clientDetailsToDto trims input and maps to API field names', () => {
    const dto = clientDetailsToDto(4, {
      ...emptyClientDraft(),
      name: '  Sam Lee ',
      email: ' sam@example.com',
      dateOfBirth: '2000-05-06',
      insurance: { companyId: 2, memberId: ' X ', companyPhone: '' },
    });
    expect(dto).toMatchObject({
      ClientID: 4,
      ClientName: 'Sam Lee',
      ClientEmail: 'sam@example.com',
      ClientDoB: '2000-05-06',
      InsuranceCoID: 2,
      ClientInsuranceMemberID: 'X',
    });
  });

  it('insuranceCompanyFromDto maps insurance companies', () => {
    expect(insuranceCompanyFromDto({ InsuranceCoID: 1, InsuranceCoName: 'Aetna' })).toEqual({
      id: 1,
      name: 'Aetna',
      phone: '',
    });
  });
});
