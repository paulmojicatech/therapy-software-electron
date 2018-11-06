import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
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
import { reducer } from './state/user.reducer';
import { LoginComponent } from './login.component';
import { LoginService } from './services/login.service';

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
        HttpModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        RouterModule.forChild(userRoutes),
        StoreModule.forFeature('users', reducer)
    ],
    declarations: [LoginComponent],
    providers: [
        LoginService
    ]
})

export class UserModule { }