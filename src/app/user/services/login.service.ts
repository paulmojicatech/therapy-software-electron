import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ResultStatus } from '../models/userModel';

@Injectable()
export class LoginService {
    constructor(private _http:HttpClient){ }

    public Login(details: any): Observable<ResultStatus> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let opts = new RequestOptions({ headers: headers, body: details });
        return this._http.post<ResultStatus>('https://api.paulmojicatech.com/api/TherapySoftware/Login', opts).pipe(
            catchError(err => {
                return throwError(err);
            })
        );
    }
}