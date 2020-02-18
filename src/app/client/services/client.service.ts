import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Clients, DischargeDetail } from '../models/clientModel';
import { GetClientsUri,
    SendMassEmailUri,
    AddClientSessionUri,
    AddClientUri,
    DeleteClientSessionUri,
    DeleteClientUri,
    SaveClientUri } from '../../../env';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    constructor(private _http: HttpClient) { }

    public GetAllClients(): Observable<Clients[]> {
        
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this._http.get(`${GetClientsUri}`, { headers }).pipe(
        map((resp: any[]) => {
            const clients = this.convertDbModelToAppModel(resp);
            return clients;
        }),
        catchError(err => {
            return of(JSON.parse(err.json()));
        })
    );
        
    }

    private convertDbModelToAppModel(dbModel: any[]): Clients[] {
        const clients: Clients[] = [];
        dbModel.forEach(client => {
            const current:Clients = {
                GeneralDetails: {
                    ClientID: client.ClientID,
                    ClientName: client.ClientName,
                    ClientPhone: client.ClientPhone,
                    ClientEmail: client.ClientEmail,
                    ClientAddress: client.ClientAddress,
                    ClientCity: client.ClientCity,
                    ClientState: client.State,
                    ClientZip: client.ClientZip,
                    ClientDoB: client.ClientDoB,
                    ClientSecondaryPhone: client.ClientSecondaryPhone,
                    ClientSecondaryEmail: client.ClientSecondaryEmail
                },
                ClientSessionDetails: client.ClientSessions
            };
            clients.push(current);
        });
        return clients;
    }

    public SaveClientDetails(details: Clients): Observable<Clients> {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        const updatedClient = details.GeneralDetails;
        return this._http.request<any>('put', `${SaveClientUri}`, { headers, body: { updatedClient } }).pipe(
            map(clientResp => {
                if (!!clientResp) {
                    const appModelClient = this.convertDbModelToAppModel([clientResp]);
                    return appModelClient[0];
                } else {
                    throwError('Error on saving client');
                }
            }),
            catchError(err => {
                return of(err);
            })
        );
    }

    public DeleteClient(curClient: Clients): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        let params = new HttpParams();
        params.append('clientId', `${curClient.GeneralDetails.ClientID}`);
        return this._http.delete(`${DeleteClientUri}`, { headers, params }).pipe(
            catchError(err => {
                return of(JSON.parse(err.json()));
            })
        );
    }

    public DischargeClient(dischargeDetail: DischargeDetail): Observable<Clients[]> {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        let params = new HttpParams();
        params.append('clientId', `${dischargeDetail.ClientID}`);
        params.append('dischargeReason', dischargeDetail.DischargeReason);
        params.append('dischargeNote', dischargeDetail.DischargeNote);
        return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/DischargeClient', { headers, params }).pipe(
            catchError(err => {
                return of(JSON.parse(err));
            })
        );
    
    }

    public AddClientAppointment(c: Clients): Observable<{clientSessionId: number, clientId: number, newClientSession: string }> {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        
        const clientId = c.GeneralDetails.ClientID;
        // get last session
        const lastSession = c.ClientSessionDetails.length - 1;
        const clientSessionDate = new Date(c.ClientSessionDetails[lastSession].ClientSessionDate).toISOString();
        const clientSessionToAdd = {clientId, clientSessionDate};
        return this._http.post<{clientSessionId: number, clientId: number, newClientSession: string }>(`${AddClientSessionUri}`, {headers, clientSessionToAdd});
    }

    public DeleteClientAppointment(clientId: number, clientSessionId: number): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        const sessionToDelete = { clientId, clientSessionId };
        return this._http.request<{clientId: number, clientSessionId: number}>
            ('delete', `${DeleteClientSessionUri}`, { body: sessionToDelete, headers }).pipe(
            catchError(err => {
                console.log('ERR', err);
                return of(JSON.parse(err.json()));
            })
        );
        
    }
    
    public SendMassEmail(emailSubject: string, emailMsg: string, clientsToInclude: number[]): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        
        let params = new HttpParams();
        params.append('subject', emailSubject);
        params.append('message', emailMsg);
        params.append('clientsToInclude', `${clientsToInclude}`);
        
        return this._http.post(`${SendMassEmailUri}`, {headers, params}).pipe(
            catchError(err => {
                return of(JSON.parse(err.json()));
            })
        );
    
    }

    public AddClient(client: Clients): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        let params = new HttpParams();
        params.append('newClient', JSON.stringify(client.GeneralDetails));
            
        return this._http.post(`${AddClientUri}`, {headers, params}).pipe(
            catchError(err => {
                return of(err);
            })
        );
       
    }
}