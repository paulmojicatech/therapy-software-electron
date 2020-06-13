import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from './state/app.state';
import * as clientActions from './client/state/client.actions';
import * as fromClient from './client/state/index';
import { Clients } from './client/models/clientModel';
import { tap } from 'rxjs/operators';
import { User } from './user/models/userModel';
import { MatDialog } from '@angular/material/dialog';
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
  currentCalendarWeek$: Observable<Date>;

  ngOnInit(): void { 
    this._store.dispatch(new clientActions.LoadClients());
    
    // getLoadState
    this.isLoading$ = this._store.pipe(
      select(fromClient.getLoadState)
    );

    // getClients
    this.clients$ = this._store.pipe(
      select(fromClient.getAllClients)
    );  
    
    // get current calendar week
    this.currentCalendarWeek$ = this._store.pipe(
      select(fromClient.getCurrentCalendarWeek)
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
