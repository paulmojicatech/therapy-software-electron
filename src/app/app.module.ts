import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MatInputModule, 
         MatFormFieldModule,
         MatToolbarModule,
         MatProgressSpinnerModule, 
         MatButtonModule, 
         MatDialogModule,
         MatSelectModule, 
         MatOptionModule,
         MatCheckboxModule
        } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { UserModule } from './user/user.module';
import * as userReducers from './user/state/user.reducer';
import { ClientModule } from './client/client.module';
import * as clientReducers from './client/state/client.reducer';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { PanelComponent } from './shared/panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './shared/calendar.component';
import { DateAdapter, CalendarModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { InputModalComponent } from './shared/input-modal.component';

const appRoutes: Route[] = [
  {
    path: '', component: HomeComponent,
    children: [
      {
        path: 'login', 
        loadChildren: './user/user.module#UserModule'
      },
      {
        path: 'clients/:id',
        loadChildren: './client/client.module#ClientModule'
      }
    ]
  }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PanelComponent,
    CalendarComponent,
    InputModalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    UserModule,
    ClientModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      name: 'Therapy Software DevTools',
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([]),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [],
  entryComponents: [
    InputModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
