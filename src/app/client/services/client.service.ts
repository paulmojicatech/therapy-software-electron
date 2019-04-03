import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Clients, DischargeDetail } from '../models/clientModel';
import { GetClientsUri, AUTH, SaveClientUri } from '../../../env';
import { RequestOptions, Http, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { ResultStatus } from 'src/app/user/models/userModel';

@Injectable()
export class ClientService {
    constructor(private _http:Http) { }

    public GetAllClients(): Observable<Clients[]> {
        let token = localStorage.getItem('session-token');
        if (token){
            let headers: Headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let opts = new RequestOptions({ headers: headers, body: {}});
            return this._http.get(GetClientsUri + '&auth=' + AUTH, opts).pipe(
                map(resp => {
                    let clients:Clients[] = [];
                    resp.json().forEach(c => {
                        let client:Clients = {
                            GeneralDetails: {
                                ClientID: +c.ClientID,
                                ClientName: c.ClientName,
                                ClientLastName: c.ClientName.split(' ')[1],
                                ClientEmail: c.ClientEmail
                            },
                            ClientSessionDetails: c['ClientSessionDetails']
                        };
                        clients.push(client);
                    });
                    return clients;
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }
    public SaveClientDetails(details:Clients): Observable<Clients> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token){
            let opts = new RequestOptions({headers: headers, body:JSON.stringify({ 
                    'client': {
                        ClientID: details.GeneralDetails.ClientID.toString(),
                        ClientName: details.GeneralDetails.ClientName,
                        ClientEmail: details.GeneralDetails.ClientEmail,
                        ClientSecondaryEmail: details.GeneralDetails.ClientSecondaryEmail,
                        ClientPhone: details.GeneralDetails.ClientPhone,
                        ClientAddress: details.GeneralDetails.ClientAddress,
                        ClientCity: details.GeneralDetails.ClientCity,
                        ClientState: details.GeneralDetails.ClientState,
                        ClientZip: details.GeneralDetails.ClientZip,
                        ClientDoB: details.GeneralDetails.ClientDoB,
                        ClientSSN: details.GeneralDetails.ClientSSN,
                        ClientSecondaryPhone: details.GeneralDetails.ClientSecondaryPhone,
                        IsDischarged: details.GeneralDetails.IsDischarged,
                        ClientInsuranceMemberID: details.InsuranceDetails.InsuranceMemberID,
                        InsuranceCoID: details.InsuranceDetails.InsuranceCompany.InsuranceCompanyID,
                        InsurancePhone: details.InsuranceDetails.InsuranceCompanyPhone,
                        PolicyHolderName: details.InsuranceDetails.PolicyHolderName,
                        PolicyHolderDoB: details.InsuranceDetails.PolicyDoB,
                        POlicyHolderIsSameAsClient: details.InsuranceDetails.IsSameAsClient,
                        DischargeDate: details.GeneralDetails.DischargeDate,
                        DischargeNote: details.GeneralDetails.DischargeNote
                    }
                })
            });
            return this._http.put(SaveClientUri + '&auth=' + AUTH, opts).pipe(
                map(resp => {
                    console.log("AUTH", resp.json());

                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }
    public DeleteClient(curClient:Clients): Observable<Clients[]> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            let opts = new RequestOptions({headers: headers, body:{ 'token': btoa(token), 'client': curClient}});
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/DeleteClient', opts).pipe(
                map(resp => {
                    const res:ResultStatus = JSON.parse(resp.json());
                    if (res.Type === 1) {
                        return JSON.parse(res.Message);
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }
    public DischargeClient(dischargeDetail: DischargeDetail): Observable<Clients[]> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            let opts = new RequestOptions({ 
                    headers: headers, 
                    body: { 
                        'token': btoa(token), 
                        'clientId': dischargeDetail.ClientID,
                        'dischargeReason': dischargeDetail.DischargeReason,
                        'dischargeNote': dischargeDetail.DischargeNote
                    }
            });
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/DischargeClient', opts).pipe(
                map(resp => {
                    const res:ResultStatus = JSON.parse(resp.json()); 
                    if (res.Type === 1) {
                        return JSON.parse(res.Message);
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err))
                })
            );
        }
    }

    public GetClientAppointments(startDate:string, endDate:string): Observable<Clients[]> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const token = localStorage.getItem('session-token');
        if (token){
            let opts = new RequestOptions({
                headers: headers, 
                body:{ 
                    'token': btoa(token), 
                    'startDate': startDate,
                    'endDate': endDate 
                }
            });
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/GetClientAppointments', 
                opts).pipe(
                map(resp => {
                    const res:ResultStatus = JSON.parse(resp.json());
                    if (res.Type === 1){
                        return res.Message;
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
            
        }
    }

    public AddClientAppointment(c:Clients): Observable<Clients> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            const clientId = c.GeneralDetails.ClientID;
            // get last session
            const lastSession = c.ClientSessionDetails.length - 1;
            const clientSessionTime = c.ClientSessionDetails[lastSession].ClientSessionDate;
            let opts = new RequestOptions({headers: headers, body:{ 
                'token': btoa(token), 
                'clientId': clientId,
                'apptDate': clientSessionTime
            }});
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/AddClientSesson', opts).pipe(
                map(resp => {
                    const resStatus:ResultStatus = JSON.parse(resp.json());
                    if (resStatus.Type === 1) {
                        return JSON.parse(resStatus.Message);
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }

    public DeleteClientAppointment(id:number): Observable<Clients[]> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            const opts = new RequestOptions({headers: headers, body:{ 
                'token': btoa(token), 
                'clientSessionId': id
            }});
            return this._http.delete('https://api.paulmojicatech.com/api/TherapySoftware/DeleteClientSession', opts).pipe(
                map(resp => {
                    const respStatus:ResultStatus = JSON.parse(resp.json());
                    if (respStatus.Type === 1){
                        return JSON.parse(respStatus.Message);
                    }
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()))
                })
            );
        }
    }

    public SendMassEmail(emailSubject: string, emailMsg: string, clientsToInclude: number[]): Observable<ResultStatus> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            let opts = new RequestOptions({headers: headers, body:{ 
                'token': btoa(token), 
                'emailSubject': emailSubject,
                'emailMsg': emailMsg,
                'clientsToInclude': clientsToInclude
            }});
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/SendMassEmail', opts).pipe(
                map(resp => {
                    const resStatus:ResultStatus = JSON.parse(resp.json());
                    return resStatus;
                }),
                catchError(err => {
                    return of(JSON.parse(err.json()));
                })
            );
        }
    }

    public AddClient(client:Clients): Observable<Clients> {
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let token = localStorage.getItem('session-token');
        if (token) {
            const opts = {headers: headers, body:{token: btoa(token), client: client}};
            return this._http.post('https://api.paulmojicatech.com/api/TherapySoftware/AddClient', opts).pipe(
                map(resp => {
                    const resStatus:ResultStatus = JSON.parse(resp.json());
                    if (resStatus.Type === 1){
                        return JSON.parse(resStatus.Message);
                    }
                }),
                catchError(err => {
                    return of (JSON.parse(err));
                })
            );
        }
    }
}