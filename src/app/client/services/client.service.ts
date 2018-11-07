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
                        return details;
                    }
                    
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }
}