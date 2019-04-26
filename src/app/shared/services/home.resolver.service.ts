import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../../state/app.state';
import { Observable, of } from 'rxjs';
import * as clientActions from '../../client/state/client.actions';
import * as fromClient from '../../client/state/index';
 
@Injectable()
export class HomeRouteResolver implements Resolve<boolean> {
    constructor(private _store:Store<State>){}

    resolve():Observable<boolean>{
        this._store.dispatch(new clientActions.LoadClients());

        this._store.pipe(
            select(fromClient.getAllClients)
        ).subscribe(l => {
            return of(true);
        }).unsubscribe();
        return null;
    }
}