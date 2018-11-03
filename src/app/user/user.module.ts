import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { MatFormFieldModule, 
         MatInputModule,
         MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { reducer } from './state/user.reducer';
import { LoginComponent } from './login.component';

const userRoutes: Route[] = [
    {
        path: 'login', component: LoginComponent
    }
];

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        RouterModule.forChild(userRoutes),
        StoreModule.forFeature('users', reducer)
    ],
    declarations: [LoginComponent]

})

export class UserModule { }