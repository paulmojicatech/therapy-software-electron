import { Http, RequestOptions, Headers } from "@angular/http";
import { InsuranceCompanies } from "release-builds/therapy-software-darwin-x64/therapy-software.app/Contents/Resources/app/src/app/client/models/clientModel";
import * as env from '../../../env'
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';

@Injectable()
export class InsuranceService {
    constructor(private _http:Http){ }

    public GetAllInsurances():Observable<InsuranceCompanies[]> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const opts = new RequestOptions({ headers: headers, body: {}}); 
        return this._http.post(env.GetInsuranceUri + '&auth=' + env.AUTH, opts).pipe(
            map(resp => {
                return resp.json();
            })    
        );
    }
}