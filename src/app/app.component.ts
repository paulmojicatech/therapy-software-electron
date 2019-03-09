import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ClientState } from './client/state/client.reducer'; 
import * as fromClient from './client/state/index';
import { Observable } from 'rxjs/observable';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private _store:Store<ClientState>){ }

  title = 'therapy-software';
  isLoading$:Observable<boolean>;

  ngOnInit():void {
    this.isLoading$ = this._store.pipe(
      select(fromClient.getLoadState)
    );
  }
  loadComplete() {

  }
}
