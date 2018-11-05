import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './state/client.reducer';
import { ClientDetailsComponent } from './client-details.component';
import { ClientService } from './services/client.service';
import { ClientEffects } from './state/client.effects';

const clientRoutes:Route[] = [
    {
        path: 'clients/:id', component: ClientDetailsComponent, pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        BrowserModule, 
        HttpModule,
        RouterModule.forChild(clientRoutes),
        StoreModule.forFeature('clients', reducer),
        EffectsModule.forFeature([ ClientEffects ])
    ],
    declarations: [ClientDetailsComponent],
    providers: [
        ClientService
    ]
})

export class ClientModule { }