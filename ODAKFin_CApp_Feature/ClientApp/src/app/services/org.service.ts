import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Region, Office, State, SalesOffice, Org, DynamicGrid, DivisionTypes } from 'src/app/model/org';
import { City } from '../model/common';
import { Globals } from '../globals';

@Injectable({
    providedIn: 'root'
})

export class OrgService {

    /* readonly APIUrl = "https://localhost:44301/api";*/
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
    //---OFFICE---//
    getRegionList(OL: Region): Observable<Region[]> {

        return this.http.post<Region[]>(this.globals.APIURL + '/OrgStructure/RegionView', OL, this.createAuthHeader());
    }
    getRegionEdit(OL: Region): Observable<Region[]> {
        return this.http.post<Region[]>(this.globals.APIURL + '/OrgStructure/RegionEdit', OL, this.createAuthHeader());
    }

    saveRegion(OD: Region) {

        return this.http.post(this.globals.APIURL + '/OrgStructure/RegionInsert/', OD, this.createAuthHeader());
    }
    //-Region end---//

    //---OFFICE---//
    getCityBind(OL: City): Observable<City[]> {

        return this.http.post<City[]>(this.globals.APIURL + '/home/cityBind', OL, this.createAuthHeader());
    }

    getCitiesBindByCountry(OL: City): Observable<City[]> {

        return this.http.post<City[]>(this.globals.APIURL + '/OrgStructure/BindCitiesByCountry', OL, this.createAuthHeader());
    }
    getStateBind(OL: State): Observable<State[]> {

        return this.http.post<State[]>(this.globals.APIURL + '/home/stateBind', OL, this.createAuthHeader());
    }
    getStatesBindByCtry(OL: State): Observable<State[]> {

        return this.http.post<State[]>(this.globals.APIURL + '/OrgStructure/BindStatesByCountry', OL, this.createAuthHeader());
    }

    getOfficeList(OL: Office): Observable<Office[]> {

        return this.http.post<Office[]>(this.globals.APIURL + '/OrgStructure/OfficeView', OL, this.createAuthHeader());
    }
    getOfficeEdit(OL: Office): Observable<Office[]> {
        return this.http.post<Office[]>(this.globals.APIURL + '/OrgStructure/OfficeEdit', OL, this.createAuthHeader());
    }

    saveOffice(OD: Office) {

        return this.http.post(this.globals.APIURL + '/OrgStructure/OfficeInsert/', OD, this.createAuthHeader());
    }
    //--OFFICE end---//

    //--sales OFFICE ---//

    getOfficeLocBind(OL: Office): Observable<Office[]> {

        return this.http.post<Office[]>(this.globals.APIURL + '/OrgStructure/OfficeLocBind', OL, this.createAuthHeader());
    }
    getOfficeByLoc(id): Observable<Office[]> {

        return this.http.get<Office[]>(this.globals.APIURL + '/OrgStructure/OfficeByLoc/' + id, this.createAuthHeader());
    }
    getOfficeByLocs(OL: Office): Observable<Office[]> {

        return this.http.post<Office[]>(this.globals.APIURL + '/OrgStructure/OfficeByLocs', OL, this.createAuthHeader());
    }
    saveSalesOffice(OD: SalesOffice) {

        return this.http.post(this.globals.APIURL + '/OrgStructure/SalesOfficeInsert/', OD, this.createAuthHeader());
    }
    getSalesOfficeView(OL: SalesOffice): Observable<SalesOffice[]> {
        return this.http.post<SalesOffice[]>(this.globals.APIURL + '/OrgStructure/SalesOfficeView', OL, this.createAuthHeader());
    }
    getSalesOfficeEdit(OL: SalesOffice): Observable<SalesOffice[]> {
        return this.http.post<SalesOffice[]>(this.globals.APIURL + '/OrgStructure/SalesOfficeEdit', OL, this.createAuthHeader());
    }
    //--sales OFFICE end ---//

    //---ORGANISATION---//

    saveOrg(OD: Org) {

        return this.http.post(this.globals.APIURL + '/OrgStructure/OrgInsert/', OD);
    }

    getRegionBindList(OL: Region): Observable<Region[]> {

        return this.http.post<Region[]>(this.globals.APIURL + '/OrgStructure/RegionBindList', OL, this.createAuthHeader());
    }

    getSalesOfficeByOfficeLoc(OL: SalesOffice): Observable<SalesOffice[]> {

        return this.http.post<SalesOffice[]>(this.globals.APIURL + '/OrgStructure/SalesOfficeByOfficeLoc', OL, this.createAuthHeader());
    }

    getOrgList(OL: Org): Observable<Org[]> {

        return this.http.post<Org[]>(this.globals.APIURL + '/OrgStructure/OrgView', OL, this.createAuthHeader());
    }

    getOrgEdit(OL: Org): Observable<Org[]> {
        return this.http.post<Org[]>(this.globals.APIURL + '/OrgStructure/OrgEdit', OL, this.createAuthHeader());
    }

    getOrgDtlsEdit(OL: DynamicGrid): Observable<DynamicGrid[]> {
        return this.http.post<DynamicGrid[]>(this.globals.APIURL + '/OrgStructure/OrgDetailsEdit', OL, this.createAuthHeader());
    }

    getSalesLocBind(OL: SalesOffice): Observable<SalesOffice[]> {

        return this.http.post<SalesOffice[]>(this.globals.APIURL + '/OrgStructure/SalesLocBind', OL, this.createAuthHeader());
    }

    getOfficeLocBySalesOffice(OL: SalesOffice): Observable<SalesOffice[]> {

        return this.http.post<SalesOffice[]>(this.globals.APIURL + '/OrgStructure/OfficeLocBySalesOffice', OL, this.createAuthHeader());
    }
    OrgOfficeDtlsDelete(OD: Org) {

        return this.http.post(this.globals.APIURL + '/OrgStructure/OrgOfficeDtlsDelete/', OD);
    }
    getDivisionTypes(OL: DivisionTypes): Observable<DivisionTypes[]> {

        return this.http.post<DivisionTypes[]>(this.globals.APIURL + '/OrgStructure/DivisionsBind', OL, this.createAuthHeader());
    }
    OrgExistingDivisonTypes(OL: DivisionTypes): Observable<DivisionTypes[]> {
        return this.http.post<DivisionTypes[]>(this.globals.APIURL + '/OrgStructure/OrgExistingDivisionTypes', OL, this.createAuthHeader());
    }

    //---ORGANISATION END---//


}