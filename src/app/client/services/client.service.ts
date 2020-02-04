import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Clients, DischargeDetail } from '../models/clientModel';
import { GetClientsUri, SendMassEmailUri, AddClientSessionUri, AddClientUri, DeleteClientSessionUri, DeleteClientUri, SaveClientUri } from '../../../env';
import { RequestOptions, Http, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { ResultStatus } from 'src/app/user/models/userModel';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    constructor(private _http: Http) { }

    public GetAllClients(): Observable<Clients[]> {
        const token = localStorage.getItem('session-token');
        if (token) {
            let headers: Headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let opts = new RequestOptions({
                headers: headers
            });
            return this._http.get(`${GetClientsUri}`, opts).pipe(
                map(resp => {
                    const clients = this.convertDbModelToAppModel(resp.json());
                    return clients;
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
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
        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const opts = new RequestOptions({
            headers: headers, body: {
                'updatedClient': details
            }
        });

        return this._http.put(`${SaveClientUri}`, opts).pipe(
            map(resp => {
              
                return resp.json();
            }),
            catchError(err => {
                return of(JSON.parse(err.json()));
            })
        );
    }
    public DeleteClient(curClient: Clients): Observable<any> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            let opts = new RequestOptions({ headers: headers, body: { 'clientId': curClient.GeneralDetails.ClientID } });
            return this._http.delete(`${DeleteClientUri}`, opts).pipe(
                map(resp => {
                    return resp.json();
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }
    public DischargeClient(dischargeDetail: DischargeDetail): Observable<Clients[]> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            let opts = new RequestOptions({
                headers: headers,
                body: {
                    'clientId': dischargeDetail.ClientID,
                    'dischargeReason': dischargeDetail.DischargeReason,
                    'dischargeNote': dischargeDetail.DischargeNote
                }
            });
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/DischargeClient', opts).pipe(
                map(resp => {
                    const res: ResultStatus = JSON.parse(resp.json());
                    if (res.Type === 1) {
                        return JSON.parse(res.Message);
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err))
                })
            );
        }
    }

    public AddClientAppointment(c: Clients): Observable<Clients> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        
        const clientId = c.GeneralDetails.ClientID;
        // get last session
        const lastSession = c.ClientSessionDetails.length - 1;
        const clientSessionTime = new Date(c.ClientSessionDetails[lastSession].ClientSessionDate).toISOString();
        let opts = new RequestOptions({
            headers: headers, body: {
                'clientId': clientId,
                'clientSessionDate': clientSessionTime
            }
        });
        return this._http.post(`${AddClientSessionUri}`, opts).pipe(
            map(resp => {
                const updatedClient = resp.json();
                const updatedSessions = updatedClient.SessionDetails;
                return {GeneralDetails: updatedClient.GeneralDetails, ClientSessionDetails: updatedSessions};
            })
        );
    }

    public DeleteClientAppointment(clientId: number, clientSessionId: number): Observable<any> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        
        const opts = new RequestOptions({
            headers: headers,
            body: { clientSessionId }
        });
        
        return this._http.delete(`${DeleteClientSessionUri}`, opts).pipe(
            map(resp => {
                
                return resp.json();
            }),
            catchError(err => {
                console.log('ERR', err);
                return of(JSON.parse(err.json()));
            })
        );
        
    }

    public SendMassEmail(emailSubject: string, emailMsg: string, clientsToInclude: number[]): Observable<any> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        
        let opts = new RequestOptions({
            headers: headers, body: {
                'subject': emailSubject,
                'message': emailMsg,
                'clientsToInclude': clientsToInclude
            }
        });
        return this._http.post(`${SendMassEmailUri}`, opts).pipe(
            map(resp => resp.json()),
            catchError(err => {
                return of(JSON.parse(err.json()));
            })
        );
    
    }

    public AddClient(client: Clients): Observable<any> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
            const opts:RequestOptions = new RequestOptions({ 
                headers: headers,
                body: { 'newClient': client.GeneralDetails } 
            });
            return this._http.post(`${AddClientUri}`, opts).pipe(
                map(resp => resp.json()),
                catchError(err => {
                    return of(err);
                })
            );
       
    }
}