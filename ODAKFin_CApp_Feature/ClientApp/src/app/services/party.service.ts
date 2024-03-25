import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Country, City, MyAgency, Port } from 'src/app/model/common';
import { DivisionTypes, State } from 'src/app/model/org';
import { BusinessTypes, Party, DynamicGridParty, PartyAttachType, BranchList, GSTList, Currency, DynamicGridAcc, DynamicGridCr, DynamicGridAlert, DynamicGridAttach, DynamicGridVendorAcc } from 'src/app/model/Party';
import { Globals } from '../globals';
@Injectable({
    providedIn: 'root'
})
export class PartyService {

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


    getLocationBind(): Observable<MyAgency[]> {

        return this.http.get<MyAgency[]>(this.globals.APIURL + '/PartyApi/BindGeoLocations');
    }

    getBusinessTypes(): Observable<BusinessTypes[]> {

        return this.http.get<BusinessTypes[]>(this.globals.APIURL + '/PartyApi/BusinessTypes');
    }

    getCitiesBind(): Observable<City[]> {

        return this.http.get<City[]>(this.globals.APIURL + '/PartyApi/CitiesBind');
    }
    getStateBind(): Observable<State[]> {

        return this.http.get<State[]>(this.globals.APIURL + '/PartyApi/StatesBind');
    }
    partySave(OD: Party) {

        return this.http.post(this.globals.APIURL + '/PartyApi/Customer/', OD);
    }

    getPartyList(OL: Party): Observable<Party[]> {

        return this.http.post<Party[]>(this.globals.APIURL + '/PartyApi/CustomerView', OL, this.createAuthHeader());
    }
    getPartyEdit(OL: Party): Observable<Party[]> {
        return this.http.post<Party[]>(this.globals.APIURL + '/PartyApi/CustomerViewParticular', OL, this.createAuthHeader());
    }
    getPartyBranchDtlsEdit(OL: DynamicGridParty): Observable<DynamicGridParty[]> {
        return this.http.post<DynamicGridParty[]>(this.globals.APIURL + '/PartyApi/CustomerBranchView', OL, this.createAuthHeader());
    }
    getPartyExistingBusTypes(OL: BusinessTypes): Observable<BusinessTypes[]> {
        return this.http.post<BusinessTypes[]>(this.globals.APIURL + '/PartyApi/BindBusinessTypes', OL, this.createAuthHeader());
    }
    PartyExistingDivisonTypes(OL: DivisionTypes): Observable<DivisionTypes[]> {
        return this.http.post<DivisionTypes[]>(this.globals.APIURL + '/PartyApi/PartyExistingDivisionTypes', OL, this.createAuthHeader());
    }

    getPartyTypeAttchments(): Observable<PartyAttachType[]> {

        return this.http.get<PartyAttachType[]>(this.globals.APIURL + '/PartyApi/AttachmentValues');
    }

    getPartyBranchList(OL: BranchList): Observable<BranchList[]> {
        return this.http.post<BranchList[]>(this.globals.APIURL + '/PartyApi/BranchDropDown', OL, this.createAuthHeader());
    }
    getPartyGSTList(OL: GSTList): Observable<GSTList[]> {
        return this.http.post<GSTList[]>(this.globals.APIURL + '/PartyApi/GSTCategory', OL, this.createAuthHeader());
    }
    getCurrencyBind(): Observable<Currency[]> {

        return this.http.get<Currency[]>(this.globals.APIURL + '/PartyApi/CurrencyValues');
    }
    partyAccSave(OD: Party) {

        return this.http.post(this.globals.APIURL + '/PartyApi/CustomerAccSave/', OD);
    }
    getPartyAccEdit(OL: DynamicGridAcc): Observable<DynamicGridAcc[]> {
        return this.http.post<DynamicGridAcc[]>(this.globals.APIURL + '/PartyApi/CustomerAccLinkView', OL, this.createAuthHeader());
    }
    getUserDetails(OL: Party): Observable<Party[]> {
        return this.http.post<Party[]>(this.globals.APIURL + '/PartyApi/UserDetails', OL, this.createAuthHeader());
    }

    partyCrSave(OD: Party) {

        return this.http.post(this.globals.APIURL + '/PartyApi/CustomerCrSave/', OD);
    }
    getPartyCrEdit(OL: DynamicGridCr): Observable<DynamicGridCr[]> {
        return this.http.post<DynamicGridCr[]>(this.globals.APIURL + '/PartyApi/CustomerCrView', OL, this.createAuthHeader());
    }
    getAlertType(OL: Party): Observable<Party[]> {
        return this.http.post<Party[]>(this.globals.APIURL + '/PartyApi/AlertTypes', OL, this.createAuthHeader());
    }
    partyEmailAlertSave(OD: Party) {

        return this.http.post(this.globals.APIURL + '/PartyApi/CustomerEmailAlertSave/', OD);
    }
    getPartyEmailDtlsEdit(OL: DynamicGridAlert): Observable<DynamicGridAlert[]> {
        return this.http.post<DynamicGridAlert[]>(this.globals.APIURL + '/PartyApi/CusEmailAlertUpdate', OL, this.createAuthHeader());
    }
    partyAttachSave(OD: Party) {

        return this.http.post(this.globals.APIURL + '/PartyApi/CustomerAttachments/', OD);
    }
    getPartyAttachDtlsEdit(OL: DynamicGridAttach): Observable<DynamicGridAttach[]> {
        return this.http.post<DynamicGridAttach[]>(this.globals.APIURL + '/PartyApi/CustomerAttachDetails', OL, this.createAuthHeader());
    }
    ///-----vendor--//
    getVendorList(OL: Party): Observable<Party[]> {

        return this.http.post<Party[]>(this.globals.APIURL + '/PartyApi/VendorView', OL, this.createAuthHeader());
    }

    VendorSave(OD: Party) {

        return this.http.post(this.globals.APIURL + '/PartyApi/VendorInsert/', OD);
    }
    VendorAccSave(OD: Party) {

        return this.http.post(this.globals.APIURL + '/PartyApi/VendorAccSave/', OD);
    }
    getVendorAccEdit(OL: DynamicGridVendorAcc): Observable<DynamicGridVendorAcc[]> {
        return this.http.post<DynamicGridVendorAcc[]>(this.globals.APIURL + '/PartyApi/VendorAccLinkView', OL, this.createAuthHeader());
    }

    getBranchByPOS(OL: Party): Observable<Party[]> {

        return this.http.post<Party[]>(this.globals.APIURL + '/PartyApi/BranchByPOS', OL, this.createAuthHeader());
    }
    CusVendorBranchDelete(OD: Party) {

        return this.http.post(this.globals.APIURL + '/PartyApi/CusVendorBranchDelete/', OD);
    }
    CusVendorAccLinkDelete(OD: Party) {

        return this.http.post(this.globals.APIURL + '/PartyApi/CusVendorAccLinkDelete/', OD);
    }
    CusVendorCrLinkDelete(OD: Party) {

        return this.http.post(this.globals.APIURL + '/PartyApi/CusVendorCrLinkDelete/', OD);
    }
    CusVendorAlertLinkDelete(OD: Party) {

        return this.http.post(this.globals.APIURL + '/PartyApi/CusVendorAlertLinkDelete/', OD);
    }

    ///-----vendor  end--//
}
