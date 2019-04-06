import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MatFormFieldModule, 
         MatInputModule,
         MatButtonModule,
         MatProgressSpinnerModule,
         MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './state/user.reducer';
import { LoginComponent } from './login.component';
import { LoginService } from './services/login.service';
import { UserEffects } from './state/user.effects';

const userRoutes: Route[] = [
    {
        path: 'login', component: LoginComponent
    }
];

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        RouterModule.forChild(userRoutes),
        StoreModule.forFeature('users', reducer),
        EffectsModule.forFeature([ UserEffects ])
    ],
    declarations: [LoginComponent],
    providers: [
        LoginService
    ]
})

export class UserModule { }