import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatInputModule, 
         MatFormFieldModule,
         MatToolbarModule } from '@angular/material';
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
    PanelComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    UserModule,
    ClientModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      name: 'Therapy Software DevTools',
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
