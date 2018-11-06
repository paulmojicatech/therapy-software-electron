import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as fromUser from './state/user.reducer';
import * as userActions from './state/user.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { LoginService } from './services/login.service';
import { User } from './models/userModel';

@Component({
  selector: 'pmt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(private _router: Router, 
    private _store:Store<fromUser.UserState>,
    private _builder: FormBuilder,
    private _loginSvc: LoginService) { }

  loginForm:FormGroup;
  isLoading:boolean = false;

  ngOnInit() {
    this.loginForm = this._builder.group({
      user: ['',Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.isLoading = true;
    let obj = {
      userName: this.loginForm.value.user,
      password: btoa(this.loginForm.value.password)
    };
    this._loginSvc.Login(obj).subscribe(resp => {
        this.isLoading = false;
        let curUser:User = { 
          email: this.loginForm.value.user, 
          name: 'Kirstin'
        };
        localStorage.setItem('session-token', resp);
        this._router.navigate(['']);
        this._store.dispatch(new userActions.SetCurrentUser(curUser));
    });
  }
}