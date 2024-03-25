import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Country, City, MyAgency, Port } from 'src/app/model/common';
import { DynamicGrid, State } from 'src/app/model/org';
import { BusinessTypes, Party, DynamicGridParty, PartyAttachType, BranchList, GSTList, Currency, DynamicGridAcc, DynamicGridCr, DynamicGridAlert, DynamicGridAttach, DynamicGridVendorAcc } from 'src/app/model/Party';
import { Globals } from '../globals';
import { Agency, DynamicGridPorts, DynamicGridAgency } from '../model/Agency';
import { Inventory, StatusCodes, DynamicGridStatus } from '../model/Inventory';
@Injectable({
    providedIn: 'root'
})
export class InventoryService {

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

    CntrTypeDropdown(OL: Inventory): Observable<Inventory[]> {
        return this.http.post<Inventory[]>(this.globals.APIURL + '/ContainerApi/CntrTypeSize', OL, this.createAuthHeader());
    }

    ModuleDropdown(OL: Inventory): Observable<Inventory[]> {
        return this.http.post<Inventory[]>(this.globals.APIURL + '/ContainerApi/ModuleBindList', OL, this.createAuthHeader());
    }
    PrincipalMasterBind(OL: Inventory): Observable<Inventory[]> {
        return this.http.post<Inventory[]>(this.globals.APIURL + '/ContainerApi/PrincipalMasterBind', OL, this.createAuthHeader());
    }
    getISOCODE(OL: Inventory): Observable<Inventory[]> {
        return this.http.post<Inventory[]>(this.globals.APIURL + '/ContainerApi/ISOCodeBindByType', OL, this.createAuthHeader());
    }
    CntrSave(OD: Inventory) {

        return this.http.post(this.globals.APIURL + '/ContainerApi/InsertContainers/', OD);
    }
    getContainerList(OL: Inventory): Observable<Inventory[]> {
        return this.http.post<Inventory[]>(this.globals.APIURL + '/ContainerApi/ViewContainers', OL, this.createAuthHeader());
    }
    getContainerEdit(OL: Inventory): Observable<Inventory[]> {
        return this.http.post<Inventory[]>(this.globals.APIURL + '/ContainerApi/ContainerEdit', OL, this.createAuthHeader());
    }
    getMoveList(OL: Inventory): Observable<Inventory[]> {
        return this.http.post<Inventory[]>(this.globals.APIURL + '/ContainerApi/ViewInventoryStatusCodes', OL, this.createAuthHeader());
    }
    getInvMoveEdit(OL: StatusCodes): Observable<StatusCodes[]> {
        return this.http.post<StatusCodes[]>(this.globals.APIURL + '/ContainerApi/StatusCodesEdit', OL, this.createAuthHeader());
    }
    getInvMovePossibleEdit(OL: DynamicGridStatus): Observable<DynamicGridStatus[]> {
        return this.http.post<DynamicGridStatus[]>(this.globals.APIURL + '/ContainerApi/BindStatusCodePossiblemoves', OL, this.createAuthHeader());
    }

    InvValidationDropdown(OL: Inventory): Observable<Inventory[]> {
        return this.http.post<Inventory[]>(this.globals.APIURL + '/ContainerApi/StatusValidationDropdown', OL, this.createAuthHeader());
    }
    InvStatuscodesDropdown(OL: Inventory): Observable<Inventory[]> {
        return this.http.post<Inventory[]>(this.globals.APIURL + '/ContainerApi/BindStatusCodeList', OL, this.createAuthHeader());
    }
    InvStatuscodesDesc(OL: Inventory): Observable<Inventory[]> {
        return this.http.post<Inventory[]>(this.globals.APIURL + '/ContainerApi/StatusDescriptionByStatusCode', OL, this.createAuthHeader());
    }
    StatusCodeSave(OD: StatusCodes) {

        return this.http.post(this.globals.APIURL + '/ContainerApi/InsertContainerStatusCreation/', OD);
    }
    possiblemovesDelete(OD: StatusCodes) {

        return this.http.post(this.globals.APIURL + '/ContainerApi/PossiblemovesDelete/', OD);
    }
}
