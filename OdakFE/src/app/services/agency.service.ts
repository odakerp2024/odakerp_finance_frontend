import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Country, City, MyAgency, Port } from 'src/app/model/common';
import { DynamicGrid, State } from 'src/app/model/org';
import { BusinessTypes, Party, DynamicGridParty, PartyAttachType, BranchList, GSTList, Currency, DynamicGridAcc, DynamicGridCr, DynamicGridAlert, DynamicGridAttach, DynamicGridVendorAcc } from 'src/app/model/Party';
import { Globals } from '../globals';
import { Agency, DynamicGridPorts ,DynamicGridAgency} from '../model/Agency';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {

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
    ///-----Agency--//
    getAgencyList(OL: Party): Observable<Agency[]> {

        return this.http.post<Agency[]>(this.globals.APIURL + '/PartyApi/Agencyview', OL, this.createAuthHeader());
    }
    getAgencyEdit(OL: Agency): Observable<Agency[]> {
        return this.http.post<Agency[]>(this.globals.APIURL + '/PartyApi/Agencyviewedit', OL, this.createAuthHeader());
    }
    saveAgency(OD: Agency) {

        return this.http.post(this.globals.APIURL + '/PartyApi/Agency/', OD);
    }
    PrincipalDetailsSave(OD: Agency) {

        return this.http.post(this.globals.APIURL + '/PartyApi/InsertAgencyPrincipalDtls/', OD);
    }
    PrincipalMasterBind(OL: Agency): Observable<Agency[]> {
        return this.http.post<Agency[]>(this.globals.APIURL + '/PartyApi/PrincipalMasterBind', OL, this.createAuthHeader());
    }
    getAgencyPrincipalBindEdit(OL: DynamicGridAgency): Observable<DynamicGridAgency[]> {
        return this.http.post<DynamicGridAgency[]>(this.globals.APIURL + '/PartyApi/AgencyPrincipalDtlsView', OL, this.createAuthHeader());
    }
    PortMasterBind(OL: Agency): Observable<Agency[]> {
        return this.http.post<Agency[]>(this.globals.APIURL + '/PartyApi/PortMasterBind', OL, this.createAuthHeader());
    }

    PortDetailsSave(OD: Agency) {

        return this.http.post(this.globals.APIURL + '/PartyApi/AgencyPortCodes/', OD);
    }
    getAgencyPortEdit(OL: DynamicGridPorts): Observable<DynamicGridPorts[]> {
        return this.http.post<DynamicGridPorts[]>(this.globals.APIURL + '/PartyApi/AgencyPortView', OL, this.createAuthHeader());
    }
    
    RemoveAgencyPortDtls(OD: DynamicGridPorts) {

        return this.http.post(this.globals.APIURL + '/PartyApi/RemoveAgencyPortDtls/', OD);
    }

    RemoveprDtls(OD: DynamicGridAgency) {

        return this.http.post(this.globals.APIURL + '/PartyApi/RemoveprDtls/', OD);
    }
    
}
