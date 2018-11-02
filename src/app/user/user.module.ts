import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { reducer } from './state/user.reducer';

@NgModule({
    imports: [
        StoreModule.forFeature('users', reducer)
    ]

})

export class UserModule{ }