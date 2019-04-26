import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { ClientService } from '../services/client.service';
import { InsuranceService } from '../services/insurance.service';
import * as clientActions from '../state/client.actions';
import * as userActions from '../../user/state/user.actions';
import * as appActions from '../../state/app.actions';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, concatMap } from 'rxjs/operators';

@Injectable()
export class ClientEffects {
    constructor(private _clientSvc:ClientService, 
        private _insuranceSvc:InsuranceService,
        private actions$:Actions) { }

    @Effect() 
    loadClients$: Observable<Action> = this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.LoadClients),
        concatMap(() => this._clientSvc.GetAllClients().pipe(            
            map(clients => (new clientActions.LoadClientsSuccess(clients))),
            catchError(err => of(new appActions.UpdateMessage(err)))
        )
    ));

    @Effect() 
    updateClient$: Observable<Action> = this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.UpdateClient),
        concatMap((action:clientActions.UpdateClient) => this._clientSvc.SaveClientDetails(action.payload).pipe(
            map(client => (new clientActions.UpdateClientSuccess(client))),
            map(user => (new userActions.UpdateLoadStatus(true))),
            catchError(err => of(new appActions.UpdateMessage(err)))
        )
    ));

    @Effect()
    deleteClient$: Observable<Action> = this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.DeleteClient),
        mergeMap((action:clientActions.DeleteClient) => this._clientSvc.DeleteClient(action.payload).pipe(
            map(clients => (new clientActions.DeleteClientSuccess(clients))),
            catchError(err => of(new appActions.UpdateMessage(err)))
        ))
    );

    @Effect() 
    dischargeClient$: Observable<Action> = this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.DischargeClient),
        mergeMap((action:clientActions.DischargeClient) => this._clientSvc.DischargeClient(action.payload).pipe(
            map(clients => (new clientActions.DischargeClientSuccess(clients))),
            catchError(err => of(new appActions.UpdateMessage(err)))
        ))
    );

    @Effect()
    loadClientAppointments$: Observable<Action> = this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.LoadClientAppointments),
        mergeMap((action:clientActions.LoadClientAppointments) => this._clientSvc.GetClientAppointments(action.payload.startDate, action.payload.endDate).pipe(
            map(clients => (new clientActions.LoadClientAppointmentsSuccess(clients))),
            catchError(err => of(new appActions.UpdateMessage(err)))
        )
    ));
    
    @Effect()
    addClientSession$: Observable<Action> = this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.AddClientAppointment),
        mergeMap((action:clientActions.AddClientAppointment) => this._clientSvc.AddClientAppointment(action.payload).pipe(
            map(c => (new clientActions.AddClientAppointmentSuccess(c))),
            catchError(err => of(new appActions.UpdateMessage(err)))
        )
    ));

    @Effect()
    deleteClientSession$: Observable<Action> = this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.DeleteClientAppointment),
        mergeMap((action:clientActions.DeleteClientAppointment) => this._clientSvc.DeleteClientAppointment(action.payload).pipe(
            map(clients => (new clientActions.DeleteClientAppointmentSuccess(clients))),
            catchError(err => of(new appActions.UpdateMessage(err)))
        )
    ));

    @Effect()
    AddClient$: Observable<Action> = this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.AddClient),
        mergeMap((action:clientActions.AddClient) => this._clientSvc.AddClient(action.payload).pipe(
            map(c => (new clientActions.AddClientSuccess(c))),
            catchError(err => of(new appActions.UpdateMessage(err)))
        ))
    );
    @Effect()
    loadInsuranceCompanies$: Observable<Action> = this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.LoadInsuranceCompanies),
        mergeMap((action:clientActions.LoadInsuranceCompanies) => this._insuranceSvc.GetAllInsurances().pipe(
            map(insurancesCos => (new clientActions.LoadInsuranceCompaniesSuccess(insurancesCos))),
            catchError(err => of(new appActions.UpdateMessage(err)))
        ))
    );
}   