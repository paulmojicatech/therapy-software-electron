import { Component, OnInit } from '@angular/core';
import * as fromUser from './state/user.reducer';
import * as userActions from './state/user.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'pmt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(private _router: Router, private _store:Store<fromUser.UserState>) { }

  ngOnInit() {
  }

}
