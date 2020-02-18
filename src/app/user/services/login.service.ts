import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ResultStatus } from '../models/userModel';
import { LoginUri } from 'src/env';

@Injectable()
export class LoginService {
    constructor(private _http:HttpClient){ }

    public Login(details: any): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        let params = new HttpParams();
        params.append('details', JSON.stringify(details));

        return this._http.post(LoginUri, {headers,params}).pipe(
            tap((res:any) => {
                localStorage.setItem('session-token', res.token);
            }),
            catchError(err => {
                return throwError(err);
            })
        );

    }
}