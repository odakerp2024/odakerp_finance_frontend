import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { MYPrincipalTariff, mypricipalPort, MyDynamicGridEmail } from 'src/app/model/PrincipalTraiff';
/*import { map } from 'jquery';*/
import { map, skipWhile, tap } from 'rxjs/operators'
import { LinerName, GeneralMaster, ChargeTBMaster, CurrencyMaster } from 'src/app/model/common';
import { Globals } from '../globals';
import { myTerminal } from '../model/Admin';

@Injectable({
  providedIn: 'root'
})
export class PrincipaltariffService {

    constructor(private http: HttpClient, private globals: Globals) { }

    public authToken = "";

    loadToken() {
        const token = localStorage.getItem('Token');
        this.authToken = token;
    }
    createAuthHeader() {
        this.loadToken();
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.authToken}`
        );
        return { headers };
    }

    InsertPrincipalTariff(OL: MYPrincipalTariff): Observable<MYPrincipalTariff[]> {

        return this.http.post<MYPrincipalTariff[]>(this.globals.APIURL + '/PrincipalTariff/InsertPrincipalTariffMaster', OL, this.createAuthHeader());
    }

    ViewPrincipalTariff(OL: MYPrincipalTariff): Observable<MYPrincipalTariff[]> {

        return this.http.post<MYPrincipalTariff[]>(this.globals.APIURL + '/PrincipalTariff/ViewPrincipalTariffMaster', OL, this.createAuthHeader());
    }

    EditPrincipalTariffMaster(OL: MYPrincipalTariff): Observable<MYPrincipalTariff[]> {

        return this.http.post<MYPrincipalTariff[]>(this.globals.APIURL + '/PrincipalTariff/EditPrincipalTariffMaster', OL, this.createAuthHeader());
    }
    PrincipalTariffPortViewMaster(OL: mypricipalPort): Observable<mypricipalPort[]> {

        return this.http.post<mypricipalPort[]>(this.globals.APIURL + '/PrincipalTariff/PrincipalTariffPortMaster', OL, this.createAuthHeader());
    }

    TerminalPortPortView(OL: myTerminal): Observable<myTerminal[]> {

        return this.http.post<myTerminal[]>(this.globals.APIURL + '/CommonAccessApi/BindTerminalPortMaster', OL, this.createAuthHeader());
    }

    InsertPrincipalTariffdtls(OL: MYPrincipalTariff): Observable<MYPrincipalTariff[]> {

        return this.http.post<MYPrincipalTariff[]>(this.globals.APIURL + '/PrincipalTariff/InsertPrincipalTariffMasterdtls', OL, this.createAuthHeader());
    }

    existingPrincipalTariffAgreement(OL: MYPrincipalTariff): Observable<MYPrincipalTariff[]> {

        return this.http.post<MYPrincipalTariff[]>(this.globals.APIURL + '/PrincipalTariff/ExistingPrincipalAgreementTariff', OL, this.createAuthHeader());
    }
    deletePrincipalTariff(OL: MYPrincipalTariff): Observable<MYPrincipalTariff[]> {

        return this.http.post<MYPrincipalTariff[]>(this.globals.APIURL + '/PrincipalTariff/DeletePrincipalTariff', OL, this.createAuthHeader());
    }

    InsertPrincipalTariffEmailAlert(OL: MYPrincipalTariff): Observable<MYPrincipalTariff[]> {

        return this.http.post<MYPrincipalTariff[]>(this.globals.APIURL + '/PrincipalTariff/InsertPrincipalTariffEmailAlert', OL, this.createAuthHeader());
    }

    existingPrincipalEmail(OL: MyDynamicGridEmail): Observable<MyDynamicGridEmail[]> {

        return this.http.post<MyDynamicGridEmail[]>(this.globals.APIURL + '/PrincipalTariff/ExistingPrincipalEmailAlert', OL, this.createAuthHeader());
    }

    existingPrincipalTariffAgreementView(OL: MYPrincipalTariff): Observable<MYPrincipalTariff[]> {

        return this.http.post<MYPrincipalTariff[]>(this.globals.APIURL + '/PrincipalTariff/ExistingPrincipalAgreementTariffView', OL, this.createAuthHeader());
    }
}
