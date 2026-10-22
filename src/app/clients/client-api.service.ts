import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '../core/api-endpoints';
import {
  AddSessionResponseDto,
  ClientDto,
  InsuranceCompanyDto,
  clientDetailsToDto,
  clientFromDto,
  insuranceCompanyFromDto,
  toIsoTimestamp,
} from './client-api.mapper';
import {
  Client,
  ClientDraft,
  DischargeRequest,
  InsuranceCompany,
  MassEmailRequest,
  NEW_CLIENT_ID,
  Session,
} from './client.models';

/** Thin HTTP layer over the Therapy Software API. All mapping lives in `client-api.mapper`. */
@Injectable({ providedIn: 'root' })
export class ClientApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoints = inject(API_ENDPOINTS);

  getClients(): Observable<Client[]> {
    return this.http
      .get<ClientDto[] | null>(this.endpoints.getClients)
      .pipe(map((dtos) => (dtos ?? []).map(clientFromDto)));
  }

  addClient(draft: ClientDraft): Observable<Client> {
    const newClient = clientDetailsToDto(NEW_CLIENT_ID, draft);
    return this.http
      .post<ClientDto>(this.endpoints.addClient, { newClient })
      .pipe(map(clientFromDto));
  }

  updateClient(clientId: number, draft: ClientDraft): Observable<Client> {
    const updatedClient = clientDetailsToDto(clientId, draft);
    return this.http
      .put<ClientDto>(this.endpoints.saveClient, { updatedClient })
      .pipe(map(clientFromDto));
  }

  deleteClient(clientId: number): Observable<void> {
    return this.http
      .delete(this.endpoints.deleteClient, { body: { clientId } })
      .pipe(map(() => undefined));
  }

  dischargeClient(request: DischargeRequest): Observable<void> {
    return this.http
      .post(this.endpoints.dischargeClient, {
        clientId: request.clientId,
        dischargeReason: request.reason,
        dischargeNote: request.note,
      })
      .pipe(map(() => undefined));
  }

  addSession(clientId: number, start: Date): Observable<Session> {
    const clientSessionToAdd = { clientId, clientSessionDate: start.toISOString() };
    return this.http
      .post<AddSessionResponseDto>(this.endpoints.addSession, { clientSessionToAdd })
      .pipe(
        map((response) => ({
          id: response.clientSessionId,
          start: toIsoTimestamp(response.newClientSession) ?? start.toISOString(),
        })),
      );
  }

  deleteSession(clientId: number, sessionId: number): Observable<void> {
    return this.http
      .delete(this.endpoints.deleteSession, { body: { clientId, clientSessionId: sessionId } })
      .pipe(map(() => undefined));
  }

  sendMassEmail(request: MassEmailRequest): Observable<void> {
    return this.http
      .post(this.endpoints.sendMassEmail, {
        clientsToInclude: request.clientIds,
        subject: request.subject,
        message: request.message,
        isTest: request.isTest,
      })
      .pipe(map(() => undefined));
  }

  getInsuranceCompanies(): Observable<InsuranceCompany[]> {
    return this.http
      .get<InsuranceCompanyDto[] | null>(this.endpoints.getInsuranceCompanies)
      .pipe(map((dtos) => (dtos ?? []).map(insuranceCompanyFromDto)));
  }
}
