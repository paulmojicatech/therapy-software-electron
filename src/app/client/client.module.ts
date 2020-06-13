import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
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