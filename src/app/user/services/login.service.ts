import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class LoginService {
    constructor(private _http:Http){ }

    public Login(details: any): Observable<string> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let opts = new RequestOptions({ headers: headers, body: details });
        return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/Login', opts).pipe(
            map(resp => {
                let resStaus: any = JSON.parse(resp.json());
                return resStaus.Message;
            }),
            catchError(err => {
                let errStatus = err.json().Message;
                return of(JSON.parse(errStatus));
            })
        );
    }
}