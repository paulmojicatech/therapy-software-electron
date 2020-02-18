import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InsuranceCompanies } from '../models/clientModel';
import * as env from '../../../env'
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';

@Injectable()
export class InsuranceService {
    constructor(private _http:HttpClient){ }

    public GetAllInsurances():Observable<InsuranceCompanies[]> {
        let headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return this._http.get(env.GetInsuranceUri + '&auth=' + env.AUTH, {headers}).pipe(
            map((resp: any[]) => {
                let returnObj: InsuranceCompanies[] = [];
                resp.forEach(c => {
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