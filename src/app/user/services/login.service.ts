import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ResultStatus } from '../models/userModel';
// import { LoginUri } from 'src/env';

@Injectable()
export class LoginService {
    constructor(private _http:HttpClient){ }

    // public Login(details: any): Observable<ResultStatus> {
    //     let headers: Headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     let opts = new RequestOptions({ headers: headers, body: details });
    //     return this._http.post<ResultStatus>(LoginUri, opts).pipe(
    //         tap((res) => {
    //             localStorage.setItem('session-token', res.Message);
    //         }),
    //         catchError(err => {
    //             return throwError(err);
    //         })
    //     );

    //     //return of(<ResultStatus>{Type: 1, Message: 'Kirstin'});
    // }
}