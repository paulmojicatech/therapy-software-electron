import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { ClientService } from '../services/client.service';
import * as fromClient from '../state/client.actions';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class ClientEffects {
    constructor(private _clientSvc:ClientService, 
        private actions$:Actions) { }

    @Effect() 
    loadClients$: Observable<Action> = this.actions$.pipe(
        ofType(fromClient.ClientActionTypes.LoadClients),
        mergeMap(action => this._clientSvc.GetAllClients().pipe(
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
    loadAvailableAppointments$: Observable<Action> = this.actions$.pipe(
        ofType(fromClient.ClientActionTypes.LoadAvailableAppointments),
        mergeMap((action:fromClient.LoadAvailableAppointments) => this._clientSvc.GetAvailableAppointments(action.payload.startDate, action.payload.endDate).pipe(
            map(clients => (new fromClient.LoadAvailableAppointmentsSuccess(clients))),
            catchError(err => of(new fromClient.LoadAvailableAppointmentsFail(err)))
        )
    ));
}