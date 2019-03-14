import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ClientState } from './client/state/client.reducer'; 
import * as fromClient from './client/state/index';
import { Observable } from 'rxjs/observable';
import { takeWhile } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private _store:Store<ClientState>){ }

  title = 'therapy-software';
  isLoading:boolean;
  isActive:boolean;

  ngOnInit():void {
    this.isActive = true;
    this._store.pipe(
      select(fromClient.getLoadState),
      takeWhile(() => !this.isActive)
    ).subscribe(loading => {
      this.isLoading = loading;
    });
  }
  ngOnDestroy(): void {
    this.isActive = false;
  }
}
