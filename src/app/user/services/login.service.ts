import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ResultStatus } from '../models/userModel';

@Injectable()
export class LoginService {
    constructor(private _http:Http){ }

    public Login(details: any): Observable<ResultStatus> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let opts = new RequestOptions({ headers: headers, body: details });
        return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/Login', opts).pipe(
            map(resp => {
                let resStaus:ResultStatus = JSON.parse(resp.json());
                return resStaus;
            }),
            catchError(err => {
                let errStatus = err.json().Message;
                return of(JSON.parse(errStatus));
            })
        );
    }
}