import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { MatFormFieldModule,
         MatInputModule,
         MatTabsModule,
         MatSelectModule,
         MatOptionModule,
         MatButtonModule,
         MatDialogModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './state/client.reducer';
import { ClientDetailsComponent } from './client-details.component';
import { ClientService } from './services/client.service';
import { InsuranceService } from './services/insurance.service';
import { ClientEffects } from './state/client.effects';
import { InsuranceDetailsComponent } from './insurance-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const clientRoutes:Route[] = [
    {
        path: 'clients/:id', 
        component: ClientDetailsComponent, 
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        BrowserAnimationsModule,
        BrowserModule, 
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatDialogModule,
        RouterModule.forChild(clientRoutes),
        StoreModule.forFeature('clients', reducer),
        EffectsModule.forFeature([ ClientEffects ])
    ],
    declarations: [ClientDetailsComponent, InsuranceDetailsComponent],
    providers: [
        InsuranceService
    ]
})

export class ClientModule { }