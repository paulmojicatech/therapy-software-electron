import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Clients } from '../models/clientModel';
import { RequestOptions, Http, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';

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
                        let clients = JSON.parse(res.Message);
                        return clients;
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }
}