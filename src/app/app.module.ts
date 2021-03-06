import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { PanelComponent } from './shared/panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './shared/calendar.component';
import { DateAdapter, CalendarModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { InputModalComponent } from './shared/input-modal.component';
import { LookupAutocompleteComponent } from './shared/lookup-autocomplete/lookup-autocomplete.component';

const appRoutes: Route[] = [
  {
    path: '', component: HomeComponent,
    children: [
      {
        path: 'clients/:id',
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
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
    InputModalComponent,
    LookupAutocompleteComponent
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
    MatAutocompleteModule,
    BrowserAnimationsModule,
    UserModule,
    ClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({},{runtimeChecks: {
      strictStateImmutability: false,
      strictActionImmutability: false,
      // disabled until https://github.com/ngrx/platform/issues/2109 is resolved
      /* strictActionImmutability: true, */
    },}),
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
  providers: [
    
  ],
  entryComponents: [
    InputModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
