import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Clients } from '../models/clientModel';
import { RequestOptions, Http, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { ResultStatus } from 'src/app/user/models/userModel';

@Injectable()
export class ClientService {
    constructor(private _http:Http) { }

    public GetAllClients(): Observable<Clients[]> {
        let token = localStorage.getItem('session-token');
        if (token){
            let headers: Headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let opts = new RequestOptions({ headers: headers, body: { 'token': btoa(token) }});
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/GetAllClients', opts).pipe(
                map(resp => {
                    let res: any = JSON.parse(resp.json());
                    if (res.Type === 1){
                        const clients = JSON.parse(res.Message);
                        return clients;
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }
    public SaveClientDetails(details:Clients): Observable<Clients> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token){
            let opts = new RequestOptions({headers: headers, body:{ 'token': btoa(token), 'client': details}});
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/SaveClientDetails', opts).pipe(
                map(resp => {
                    const resStatue:ResultStatus = JSON.parse(resp.json());
                    if (resStatue.Type === 1) {
                        return JSON.parse(resStatue.Message);
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }
    public DeleteClient(clientId:number): Observable<Clients[]> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            
        }
        return null;
    }

    public GetClientAppointments(startDate:string, endDate:string): Observable<Clients[]> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const token = localStorage.getItem('session-token');
        if (token){
            let opts = new RequestOptions({
                headers: headers, 
                body:{ 
                    'token': btoa(token), 
                    'startDate': startDate,
                    'endDate': endDate 
                }
            });
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/GetClientAppointments', 
                opts).pipe(
                map(resp => {
                    const res:ResultStatus = JSON.parse(resp.json());
                    if (res.Type === 1){
                        return res.Message;
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
            
        }
    }

    public AddClientAppointment(c:Clients): Observable<Clients> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            const clientId = c.GeneralDetails.ClientID;
            // get last session
            const lastSession = c.ClientSessionDetails.length - 1;
            const clientSessionTime = c.ClientSessionDetails[lastSession].ClientSessionDate;
            let opts = new RequestOptions({headers: headers, body:{ 
                'token': btoa(token), 
                'clientId': clientId,
                'apptDate': clientSessionTime
            }});
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/AddClientSesson', opts).pipe(
                map(resp => {
                    const resStatus:ResultStatus = JSON.parse(resp.json());
                    if (resStatus.Type === 1) {
                        return JSON.parse(resStatus.Message);
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }

    public DeleteClientAppointment(id:number): Observable<Clients[]> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            const opts = new RequestOptions({headers: headers, body:{ 
                'token': btoa(token), 
                'clientSessionId': id
            }});
            return this._http.delete('https://api.paulmojicatech.com/api/TherapySoftware/DeleteClientSession', opts).pipe(
                map(resp => {
                    const respStatus:ResultStatus = JSON.parse(resp.json());
                    if (respStatus.Type === 1){
                        return JSON.parse(respStatus.Message);
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()))
                })
            );
        }
    }

    public SendMassEmail(emailSubject: string, emailMsg: string, clientsToInclude: number[]): Observable<ResultStatus> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            let opts = new RequestOptions({headers: headers, body:{ 
                'token': btoa(token), 
                'emailSubject': emailSubject,
                'emailMsg': emailMsg,
                'clientsToInclude': clientsToInclude
            }});
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/SendMassEmail', opts).pipe(
                map(resp => {
                    const resStatus:ResultStatus = JSON.parse(resp.json());
                    return resStatus;
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }

    public AddClient(client:Clients): Observable<Clients> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            const opts = {headers: headers, body:{token: btoa(token), client: client}};
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/AddClient', opts).pipe(
                map(resp => {
                    const resStatus:ResultStatus = JSON.parse(resp.json());
                    if (resStatus.Type === 1){
                        return JSON.parse(resStatus.Message);
                    }
                }),
                catchError(err => {
                    return of (JSON.parse(err));
                })
            );
        }
    }
}