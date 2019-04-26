import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import * as fromClient from './state/index';
import * as clientActions from './state/client.actions';
import { ClientState } from './state/client.reducer';
import { Clients } from './models/clientModel';
import { takeWhile } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InsuranceCompanies } from './models/clientModel';
import { InputModalComponent } from '../shared/input-modal.component';
import { Observable } from 'rxjs';
@Component({
  selector: 'pmt-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _builder: FormBuilder,
    private _store: Store<ClientState>,
    private _dialog: MatDialog) { }

  currentClient: Clients;
  isActive: boolean;
  clientDetailsGroup: FormGroup;
  isNew: boolean;
  currentId:number;
  allInsuranceCos:InsuranceCompanies[];

  ngOnInit() {
    this.isActive = true;
    this.currentId = +this._route.snapshot.paramMap.get('id');
    this.allInsuranceCos = this._route.snapshot.data.insuranceCos;

    this.isNew = this.currentId > -1 ? false : true;
    if (this.isNew) {
      this.loadClient();
    }

    this._store.pipe(
      select(fromClient.getAllClients),
      takeWhile(() => this.isActive)
    ).subscribe(clients => {
      const found = clients.filter(c => c.GeneralDetails.ClientID === this.currentId);
      if (found) {
        this.currentClient = found[0];
        this.loadClient();
      }
    });
  }

  ngOnDestroy() {
    this.isActive = false;
  }
  loadClient() {
    if (this.currentClient) {
      this.clientDetailsGroup = this._builder.group({
        'clientName': this.currentClient.GeneralDetails.ClientName,
        'clientSSN': this.currentClient.GeneralDetails.ClientSSN,
        'clientDoB': this.currentClient.GeneralDetails.ClientDoB,
        'clientEmail': this.currentClient.GeneralDetails.ClientEmail,
        'clientSecEmail': this.currentClient.GeneralDetails.ClientSecondaryEmail,
        'clientPhone': this.currentClient.GeneralDetails.ClientPhone,
        'clientSecPhone': this.currentClient.GeneralDetails.ClientSecondaryPhone,
        'clientAddress': this.currentClient.GeneralDetails.ClientAddress,
        'clientCity': this.currentClient.GeneralDetails.ClientCity,
        'clientState': this.currentClient.GeneralDetails.ClientState,
        'clientZip': this.currentClient.GeneralDetails.ClientZip,
        'assignedInsCo': -1,
        'insuranceMemberID': '',
        'insuranceCoPhone': ''
      });
      if (this.currentClient.InsuranceDetails && this.currentClient.InsuranceDetails.InsuranceCompany) {
        this.clientDetailsGroup.get('assignedInsCo').setValue(this.currentClient.InsuranceDetails.InsuranceCompany.InsuranceCompanyID);
        this.clientDetailsGroup.get('insuranceMemberID').setValue(this.currentClient.InsuranceDetails.InsuranceMemberID);
        this.clientDetailsGroup.get('insuranceCoPhone').setValue(this.currentClient.InsuranceDetails.InsuranceCompanyPhone);
      }
    }
    else {
      this.currentClient = {
        GeneralDetails: {
          'ClientID': -1,
          'ClientName': '',
          'ClientSSN': '',
          'ClientLastName': ''
        },
        InsuranceDetails: {
          InsuranceCompany: {
            InsuranceCompanyID: -1
          }
        }
      };
      this.clientDetailsGroup = this._builder.group({
        'clientName': '',
        'clientSSN': '',
        'clientDoB': '',
        'clientEmail': '',
        'clientSecEmail': '',
        'clientPhone': '',
        'clientSecPhone': '',
        'clientAddress': '',
        'clientCity': '',
        'clientState': '',
        'clientZip': '',
        'assignedInsCo': -1,
        'insuranceMemberID': '',
        'insuranceCoPhone': ''
      });
    }
  }

  save() {
    this.currentClient = {
      GeneralDetails: {
        'ClientName': this.clientDetailsGroup.value.clientName,
        'ClientSSN': this.clientDetailsGroup.value.clientSSN,
        'ClientDoB': this.clientDetailsGroup.value.clientDoB,
        'ClientAddress': this.clientDetailsGroup.value.clientAddress,
        'ClientCity': this.clientDetailsGroup.value.clientCity,
        'ClientState': this.clientDetailsGroup.value.clientState,
        'ClientZip': this.clientDetailsGroup.value.clientZip,
        'ClientEmail': this.clientDetailsGroup.value.clientEmail,
        'ClientID': this.currentClient.GeneralDetails.ClientID,
        'ClientPhone': this.clientDetailsGroup.value.clientPhone,
        'ClientSecondaryEmail': this.clientDetailsGroup.value.clientSecEmail,
        'ClientSecondaryPhone': this.clientDetailsGroup.value.clientSecPhone,
        'ClientLastName': this.currentClient.GeneralDetails.ClientLastName
      },
      InsuranceDetails: {
        InsuranceCompany: {
          InsuranceCompanyID: this.clientDetailsGroup.value.assignedInsCo
        },
        InsuranceCompanyPhone: this.clientDetailsGroup.value.insuranceCoPhone,
        InsuranceMemberID: this.clientDetailsGroup.value.insuranceMemberID
      }
    };
    if (this.isNew) {
      this._store.dispatch(new clientActions.AddClient(this.currentClient));
    }
    else {
      this._store.dispatch(new clientActions.UpdateClient(this.currentClient));
    }
    this._router.navigate(['']);
  }
  delete() {
    this.currentClient = {
      GeneralDetails: {
        'ClientName': this.clientDetailsGroup.value.clientName,
        'ClientSSN': this.clientDetailsGroup.value.clientSSN,
        'ClientDoB': this.clientDetailsGroup.value.clientDoB,
        'ClientAddress': this.clientDetailsGroup.value.clientAddress,
        'ClientCity': this.clientDetailsGroup.value.clientCity,
        'ClientState': this.clientDetailsGroup.value.clientState,
        'ClientZip': this.clientDetailsGroup.value.clientZip,
        'ClientEmail': this.clientDetailsGroup.value.clientEmail,
        'ClientID': this.currentClient.GeneralDetails.ClientID,
        'ClientPhone': this.clientDetailsGroup.value.clientPhone,
        'ClientSecondaryEmail': this.clientDetailsGroup.value.clientSecEmail,
        'ClientSecondaryPhone': this.clientDetailsGroup.value.clientSecPhone,
        'ClientLastName': this.currentClient.GeneralDetails.ClientLastName
      },
      InsuranceDetails: {
        InsuranceCompany: {
          InsuranceCompanyID: this.clientDetailsGroup.value.assignedInsCo
        },
        InsuranceCompanyPhone: this.clientDetailsGroup.value.insuranceCoPhone,
        InsuranceMemberID: this.clientDetailsGroup.value.insuranceMemberID
      }
    };
    this._store.dispatch(new clientActions.DeleteClient(this.currentClient));
    this._router.navigate(['']);
  }
  discharge() {
    this._dialog.open(InputModalComponent, {
      data: {
        dischargeClient: this.currentId
      }
    });
  }
}