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
}