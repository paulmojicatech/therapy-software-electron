import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from './state/app.state';
import * as fromUser from './user/state/index';
import * as userActions from './user/state/user.actions';
import * as clientActions from './client/state/client.actions';
import * as fromClient from './client/state/index';
import { Clients } from './client/models/clientModel';
import { tap } from 'rxjs/operators';
import { User } from './user/models/userModel';
import { MatDialog } from '@angular/material';
import { InputModalComponent } from './shared/input-modal.component';

@Component({
  selector: 'pmt-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _store:Store<State>,
    private _dialog:MatDialog) { }

  currentUser:User;  
  msg:string;
  clients$: Observable<Clients[]>;
  isLoading$:Observable<boolean>;
  initialLoad: boolean;

  ngOnInit(): void { 
    this._store.dispatch(new clientActions.LoadClients());
    
    // getLoadState
    this.isLoading$ = this._store.pipe(
      select(fromClient.getLoadState)
    );

    // getClients
    this.clients$ = this._store.pipe(
      select(fromClient.getAllClients),
      tap(() => console.log('LOAD HOME FIRED'))
    );       
  }

  sendEmail() {
    this._dialog.open(InputModalComponent, {
      data: {
        sendEmail: true
      }
    });
  }  

  refreshClients(): void {
    this._store.dispatch(new clientActions.LoadClients());
  }
}
