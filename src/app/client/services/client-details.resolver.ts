import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { InsuranceCompanies } from '../models/clientModel';
import { InsuranceService } from './insurance.service';

@Injectable()
export class ClientDetailsResolver implements Resolve<InsuranceCompanies[]> {
    constructor(private _insSvc:InsuranceService) { }

    resolve():Observable<InsuranceCompanies[]> {
        return this._insSvc.GetAllInsurances();
    }
}