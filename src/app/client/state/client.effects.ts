import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import { ClientService } from '../services/client.service';
import { InsuranceService } from '../services/insurance.service';
import * as clientActions from '../state/client.actions';
import * as userActions from '../../user/state/user.actions';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, concatMap } from 'rxjs/operators';

@Injectable()
export class ClientEffects {
    constructor(private _clientSvc:ClientService, 
        private _insuranceSvc:InsuranceService,
        private actions$:Actions) { }

     
    loadClients$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.LoadClients),
        concatMap(() => this._clientSvc.GetAllClients().pipe(            
            map(clients => (new clientActions.LoadClientsSuccess(clients)))
        )
    )));

     
    updateClient$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.UpdateClient),
        mergeMap((action: clientActions.UpdateClient) => this._clientSvc.SaveClientDetails(action.payload).pipe(
            map(client => (new clientActions.UpdateClientSuccess(client)))
        )
    )));

    
    deleteClient$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.DeleteClient),
        mergeMap((action:clientActions.DeleteClient) => this._clientSvc.DeleteClient(action.payload).pipe(
            map(clients => (new clientActions.DeleteClientSuccess(clients)))
        ))
    ));

     
    dischargeClient$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.DischargeClient),
        mergeMap((action:clientActions.DischargeClient) => this._clientSvc.DischargeClient(action.payload).pipe(
            map(clients => (new clientActions.DischargeClientSuccess(clients)))
        ))
    ));
    
    
    addClientSession$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.AddClientAppointment),
        mergeMap((action:clientActions.AddClientAppointment) => this._clientSvc.AddClientAppointment(action.payload).pipe(
            map(c => (new clientActions.AddClientAppointmentSuccess(c)))
        )
    )));

    
    deleteClientSession$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.DeleteClientAppointment),
        mergeMap((action:clientActions.DeleteClientAppointment) => this._clientSvc.DeleteClientAppointment(action.payload.clientId, action.payload.clientSessionId).pipe(
            map(clients => (new clientActions.DeleteClientAppointmentSuccess(clients)))
        )
    )));

    
    AddClient$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.AddClient),
        mergeMap((action:clientActions.AddClient) => this._clientSvc.AddClient(action.payload).pipe(
            map(c => (new clientActions.AddClientSuccess(c)))
        ))
    ));
    
    loadInsuranceCompanies$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(clientActions.ClientActionTypes.LoadInsuranceCompanies),
        mergeMap((action:clientActions.LoadInsuranceCompanies) => this._insuranceSvc.GetAllInsurances().pipe(
            map(insurancesCos => (new clientActions.LoadInsuranceCompaniesSuccess(insurancesCos)))
        ))
    ));
}   