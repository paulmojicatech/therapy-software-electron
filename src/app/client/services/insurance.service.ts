import { Http, RequestOptions, Headers } from "@angular/http";
import { InsuranceCompanies } from '../models/clientModel';
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
        return this._http.get(env.GetInsuranceUri + '&auth=' + env.AUTH, opts).pipe(
            map(resp => {
                const insCos:any[] = resp.json();
                let returnObj: InsuranceCompanies[] = [];
                insCos.forEach(c => {
                    const obj:InsuranceCompanies = {
                        InsuranceCompanyID: c.InsuranceCoID,
                        InsuranceCompanyName: c.InsuranceCoName,
                        InsurancePhone: c.InsuranceCoPhone
                    };
                    returnObj.push(obj);
                });
                return returnObj;
            })    
        );
    }
}