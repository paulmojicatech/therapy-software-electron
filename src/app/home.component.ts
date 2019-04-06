import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromUser from './user/state/index';
import { UserState } from './user/state/user.reducer';

import { takeWhile } from 'rxjs/operators';
import { User } from './user/models/userModel';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { InputModalComponent } from './shared/input-modal.component';

import { USER, PWD } from '../env';
import * as userActions from './user/state/user.actions';

@Component({
  selector: 'pmt-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private _router:Router, 
    private _store:Store<UserState>,
    private _dialog:MatDialog) { }

  isActive:boolean;
  currentUser:User;

  ngOnInit() {
    this.isActive = true;
    this._store.pipe(
      select(fromUser.getCurrentUser),
      takeWhile(() => this.isActive)
    ).subscribe(u => {
      if (u === null){
        this._store.dispatch(new userActions.SetCurrentUser({userName: USER, password:btoa(PWD)}));
      }
      else {
        this.currentUser = u;
      }
    });
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
