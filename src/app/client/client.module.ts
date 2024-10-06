import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
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