import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromUser from './user/state/index';
import { UserState } from './user/state/user.reducer';

import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { User } from './user/models/userModel';
import { Router } from '@angular/router';

@Component({
  selector: 'pmt-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private _router:Router, private _store:Store<UserState>) { }

  isActive:boolean;
  currentUser:User;

  ngOnInit() {
    this.isActive = true;
    this._store.pipe(
      select(fromUser.getCurrentUser),
      takeWhile(() => this.isActive)
    ).subscribe(u => {
      if (u === null){
        this._router.navigate(['login']);
      }
      else {
        this.currentUser = u;
      }
    });
  }

  ngOnDestroy() {
    this.isActive = false;
  }

  isLoggedIn() {

  }

}
