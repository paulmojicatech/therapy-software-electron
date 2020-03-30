import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MatInputModule, 
         MatFormFieldModule,
         MatToolbarModule,
         MatProgressSpinnerModule, 
         MatButtonModule, 
         MatDialogModule,
         MatSelectModule, 
         MatOptionModule,
         MatCheckboxModule,
         MatAutocompleteModule
        } from '@angular/material';
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
  providers: [
    
  ],
  entryComponents: [
    InputModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
