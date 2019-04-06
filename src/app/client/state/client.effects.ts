import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { ClientService } from '../services/client.service';
import { InsuranceService } from '../services/insurance.service';
import * as fromClient from '../state/client.actions';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class ClientEffects {
    constructor(private _clientSvc:ClientService, 
        private _insuranceSvc:InsuranceService,
        private actions$:Actions) { }

    @Effect() 
    loadClients$: Observable<Action> = this.actions$.pipe(
        ofType(fromClient.ClientActionTypes.LoadClients),
        mergeMap(() => this._clientSvc.GetAllClients().pipe(
            map(clients => (new fromClient.LoadClientsSuccess(clients))),
            catchError(err => of(new fromClient.LoadClientsFail(err)))
        )
    ));

    @Effect() 
    updateClient$: Observable<Action> = this.actions$.pipe(
        ofType(fromClient.ClientActionTypes.UpdateClient),
        mergeMap((action:fromClient.UpdateClient) => this._clientSvc.SaveClientDetails(action.payload).pipe(
            map(client => (new fromClient.UpdateClientSuccess(client))),
            catchError(err => of(new fromClient.UpdateClientFail(err)))
        )
    ));

    @Effect()
    deleteClient$: Observable<Action> = this.actions$.pipe(
        ofType(fromClient.ClientActionTypes.DeleteClient),
        mergeMap((action:fromClient.DeleteClient) => this._clientSvc.DeleteClient(action.payload).pipe(
            map(clients => (new fromClient.DeleteClientSuccess(clients))),
            catchError(err => of(new fromClient.DeleteClientAppointmentFail(err)))
        ))
    );

    @Effect() 
    dischargeClient$: Observable<Action> = this.actions$.pipe(
        ofType(fromClient.ClientActionTypes.DischargeClient),
        mergeMap((action:fromClient.DischargeClient) => this._clientSvc.DischargeClient(action.payload).pipe(
            map(clients => (new fromClient.DischargeClientSuccess(clients))),
            catchError(err => of(new fromClient.DischargeClientFail(err)))
        ))
    );

    @Effect()
    loadClientAppointments$: Observable<Action> = this.actions$.pipe(
        ofType(fromClient.ClientActionTypes.LoadClientAppointments),
        mergeMap((action:fromClient.LoadClientAppointments) => this._clientSvc.GetClientAppointments(action.payload.startDate, action.payload.endDate).pipe(
            map(clients => (new fromClient.LoadClientAppointmentsSuccess(clients))),
            catchError(err => of(new fromClient.LoadClientAppointmentsFail(err)))
        )
    ));
    
    @Effect()
    addClientSession$: Observable<Action> = this.actions$.pipe(
        ofType(fromClient.ClientActionTypes.AddClientAppointment),
        mergeMap((action:fromClient.AddClientAppointment) => this._clientSvc.AddClientAppointment(action.payload).pipe(
            map(c => (new fromClient.AddClientAppointmentSuccess(c))),
            catchError(err => of(new fromClient.AddClientAppointmentFail(err)))
        )
    ));

    @Effect()
    deleteClientSession$: Observable<Action> = this.actions$.pipe(
        ofType(fromClient.ClientActionTypes.DeleteClientAppointment),
        mergeMap((action:fromClient.DeleteClientAppointment) => this._clientSvc.DeleteClientAppointment(action.payload).pipe(
            map(clients => (new fromClient.DeleteClientAppointmentSuccess(clients))),
            catchError(err => of(new fromClient.DeleteClientAppointmentFail(err)))
        )
    ));

    @Effect()
    AddClient$: Observable<Action> = this.actions$.pipe(
        ofType(fromClient.ClientActionTypes.AddClient),
        mergeMap((action:fromClient.AddClient) => this._clientSvc.AddClient(action.payload).pipe(
            map(c => (new fromClient.AddClientSuccess(c))),
            catchError(err => of(new fromClient.AddClientFail(err)))
        ))
    );
    @Effect()
    loadInsuranceCompanies$: Observable<Action> = this.actions$.pipe(
        ofType(fromClient.ClientActionTypes.LoadInsuranceCompanies),
        mergeMap((action:fromClient.LoadInsuranceCompanies) => this._insuranceSvc.GetAllInsurances().pipe(
            map(insurancesCos => (new fromClient.LoadInsuranceCompaniesSuccess(insurancesCos))),
            catchError(err => of(new fromClient.LoadInsuranceCompaniesFail(err)))
        ))
    );
}   