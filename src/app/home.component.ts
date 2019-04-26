import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from './state/app.state';
import * as fromUser from './user/state/index';
import * as userActions from './user/state/user.actions';
import * as clientActions from './client/state/client.actions';
import * as fromClient from './client/state/index';
import { Clients } from './client/models/clientModel';
import { takeWhile } from 'rxjs/operators';
import { User } from './user/models/userModel';
import { MatDialog } from '@angular/material';
import { InputModalComponent } from './shared/input-modal.component';
import { USER, PWD } from '../env';

@Component({
  selector: 'pmt-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private _store:Store<State>,
    private _dialog:MatDialog) { }

  isActive:boolean;
  currentUser:User;  
  msg:string;
  clients$:Observable<Clients[]>;
  isLoading$:Observable<boolean>;

  ngOnInit() {
    this.isActive = true;   

    // getCurrentUser
    this._store.pipe(
      select(fromUser.getCurrentUser),
      takeWhile(() => this.isActive),
    ).subscribe((u:User) => {
      if (!u){      
        this._store.dispatch(new clientActions.LoadClients());                  
        this._store.dispatch(new userActions.SetCurrentUser({userName: USER, password:btoa(PWD)}));
      }
      else {
        this.currentUser = u;               
      }
    });    
    
    // getLoadState
    this.isLoading$ = this._store.pipe(
      select(fromClient.getLoadState)
    );

    // // getClients
    this.clients$ = this._store.pipe(
      select(fromClient.getAllClients)
    );       
  }

  ngOnDestroy() {
    this.isActive = false;
  }

  sendEmail() {
    this._dialog.open(InputModalComponent, {
      data: {
        sendEmail: true
      }
    });
  }  
}
