import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS, ApiEndpoints } from '../core/api-endpoints';
import { ClientApiService } from './client-api.service';
import { emptyClientDraft } from './client.models';

const endpoints: ApiEndpoints = {
  getClients: '/clients',
  addClient: '/clients/add',
  saveClient: '/clients/save',
  deleteClient: '/clients/delete',
  dischargeClient: '/clients/discharge',
  addSession: '/sessions/add',
  deleteSession: '/sessions/delete',
  sendMassEmail: '/email',
  getInsuranceCompanies: '/insurance',
};

/** These tests pin the request shapes the existing Therapy Software API expects. */
describe('ClientApiService', () => {
  let service: ClientApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_ENDPOINTS, useValue: endpoints },
      ],
    });
    service = TestBed.inject(ClientApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('treats a null client list as empty', async () => {
    const result = firstValueFrom(service.getClients());
    http.expectOne('/clients').flush(null);
    expect(await result).toEqual([]);
  });

  it('wraps new clients in `newClient`', async () => {
    const result = firstValueFrom(service.addClient({ ...emptyClientDraft(), name: 'Zoe' }));
    const req = http.expectOne('/clients/add');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.newClient).toMatchObject({ ClientID: -1, ClientName: 'Zoe' });
    req.flush({ ClientID: 12, ClientName: 'Zoe' });
    expect((await result).id).toBe(12);
  });

  it('wraps updates in `updatedClient` and uses PUT', () => {
    void firstValueFrom(service.updateClient(3, { ...emptyClientDraft(), name: 'Amy' }));
    const req = http.expectOne('/clients/save');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.updatedClient).toMatchObject({ ClientID: 3, ClientName: 'Amy' });
    req.flush({ ClientID: 3, ClientName: 'Amy' });
  });

  it('sends the client id in the DELETE body', () => {
    void firstValueFrom(service.deleteClient(3));
    const req = http.expectOne('/clients/delete');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ clientId: 3 });
    req.flush({ ClientID: 3 });
  });

  it('books sessions with an ISO timestamp in `clientSessionToAdd`', async () => {
    const start = new Date('2026-10-23T14:00:00.000Z');
    const result = firstValueFrom(service.addSession(3, start));
    const req = http.expectOne('/sessions/add');
    expect(req.request.body).toEqual({
      clientSessionToAdd: { clientId: 3, clientSessionDate: '2026-10-23T14:00:00.000Z' },
    });
    req.flush({ clientSessionId: 40, clientId: 3, newClientSession: start.toISOString() });
    expect(await result).toEqual({ id: 40, start: start.toISOString() });
  });

  it('sends discharge details in the request body', () => {
    void firstValueFrom(service.dischargeClient({ clientId: 3, reason: 'Other', note: 'Moved' }));
    const req = http.expectOne('/clients/discharge');
    expect(req.request.body).toEqual({
      clientId: 3,
      dischargeReason: 'Other',
      dischargeNote: 'Moved',
    });
    req.flush(null);
  });

  it('sends mass emails with the selected client ids', () => {
    void firstValueFrom(
      service.sendMassEmail({ subject: 'Hi', message: 'Body', clientIds: [1, 2], isTest: true }),
    );
    const req = http.expectOne('/email');
    expect(req.request.body).toEqual({
      clientsToInclude: [1, 2],
      subject: 'Hi',
      message: 'Body',
      isTest: true,
    });
    req.flush(null);
  });
});
