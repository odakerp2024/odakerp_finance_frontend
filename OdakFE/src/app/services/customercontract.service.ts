import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { User } from 'oidc-client';
import { Globals } from '../globals';
import { Route } from '@angular/router';
import { Agency, CustomerContract, CustomerMaster, DynamicGridAttach, DynamicGridContainer,
     Port, RateRequest, RouteMaster, SalesPersonMaster } from '../model/CustomerContract';



@Injectable({
  providedIn: 'root'
})
export class CustomercontractService {

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
    getCustomerMaster(OL: CustomerMaster): Observable<CustomerMaster[]> {
        return this.http.post<CustomerMaster[]>(this.globals.APIURL + '/customercontract/CustomerMaster', OL);
    }
    getPrincipalMaster(OL: Agency): Observable<Agency[]> {
        return this.http.post<Agency[]>(this.globals.APIURL + '/customercontract/PrincipalMasterBind', OL);
    }
   
    getOrignMaster(): Observable<Port[]> {
        return this.http.get<Port[]>(this.globals.APIURL + '/home/portBind');
    }
    getDischargePort(): Observable<Port[]> {
        return this.http.get<Port[]>(this.globals.APIURL + '/home/portBind');
    }
    getLoadPort(): Observable<Port[]> {
        return this.http.get<Port[]>(this.globals.APIURL + '/home/portBind');
    }
    getDestination(): Observable<Port[]> {
        return this.http.get<Port[]>(this.globals.APIURL + '/home/portBind');
    }
    getRouteMaster(OL: RouteMaster): Observable<RouteMaster[]> {
        return this.http.post<RouteMaster[]>(this.globals.APIURL + '/customercontract/RouteMaster', OL);
    }
    getDeliveryTermsMaster(OL: RouteMaster): Observable<RouteMaster[]> {
        return this.http.post<RouteMaster[]>(this.globals.APIURL + '/customercontract/DeliveryTermsMaster', OL);
    }
    getSalesPersonMaster(OL: SalesPersonMaster): Observable<SalesPersonMaster[]> {
        return this.http.post<SalesPersonMaster[]>(this.globals.APIURL + '/customercontract/SalesPersonMaster', OL);
    }
    getCustomerContractList(OL: CustomerContract): Observable<CustomerContract[]> {
        return this.http.post<CustomerContract[]>(this.globals.APIURL + '/customercontract/CustomerContractMasterView', OL);
    }
    getCustomerContractEdit(OL: CustomerContract): Observable<CustomerContract[]> {
        return this.http.post<CustomerContract[]>(this.globals.APIURL + '/customercontract/CustomerContractMasterEdit', OL);
    }
    getCargoMaster(OL: RouteMaster): Observable<RouteMaster[]> {
        return this.http.post<RouteMaster[]>(this.globals.APIURL + '/customercontract/CargoTypeMaster', OL);
    }
    getContainerMasterDtlsEdit(OL: DynamicGridContainer): Observable<DynamicGridContainer[]> {
        return this.http.post<DynamicGridContainer[]>(this.globals.APIURL + '/customercontract/ContainerMasterEdit', OL);
    }
    getRRNo(OL: RateRequest): Observable<RateRequest[]> {
        return this.http.post<RateRequest[]>(this.globals.APIURL + '/customercontract/RateReqDropDown', OL);
    }
    getExRRValues(OL: CustomerContract): Observable<CustomerContract[]> {
        return this.http.post<CustomerContract[]>(this.globals.APIURL + '/customercontract/ExRRValues', OL);
    }
    getExRRContValues(OL: DynamicGridContainer): Observable<DynamicGridContainer[]> {
        return this.http.post<DynamicGridContainer[]>(this.globals.APIURL + '/customercontract/ExRRContValues', OL);
    }
    
    saveContract(OD: CustomerContract) {
        return this.http.post(this.globals.APIURL + '/customercontract/CustomerContractInsert/', OD);
    }

    saveCopyContract(OD: CustomerContract) {
        return this.http.post(this.globals.APIURL + '/customercontract/InsertCopyContract/', OD);
    }
    updateApproveStatus(OD: CustomerContract) {
        return this.http.post(this.globals.APIURL + '/customercontract/ApproveStatus/', OD);
    }
    updateRejectStatus(OD: CustomerContract) {
        return this.http.post(this.globals.APIURL + '/customercontract/RejectStatus/', OD);
    }

    updateCancelStatus(OD: CustomerContract) {
       
        return this.http.post(this.globals.APIURL + '/customercontract/CancelStatus/', OD);
    }
    AttachDelete(OD: CustomerContract) {
        return this.http.post(this.globals.APIURL + '/customercontract/AttachDelete/', OD);
    }
    AttachUpload(file): Observable<any> {

        const formData = new FormData();
        formData.append("file", file, file.name);
        return this.http.post(this.globals.APIURL + '/customercontract/upload/', formData)
    }
    AttachmentView(OL: DynamicGridAttach): Observable<DynamicGridAttach[]> {
        return this.http.post<DynamicGridAttach[]>(this.globals.APIURL + '/customercontract/AttachmentView', OL);
    }
    getRejectReason(OL: RouteMaster): Observable<RouteMaster[]> {
        return this.http.post<RouteMaster[]>(this.globals.APIURL + '/customercontract/RejectReason', OL);
    }
    getCancelReason(OL: RouteMaster): Observable<RouteMaster[]> {
        return this.http.post<RouteMaster[]>(this.globals.APIURL + '/customercontract/CancelReason', OL);
    }
    ContainerDelete(OD: CustomerContract) {
        return this.http.post(this.globals.APIURL + '/customercontract/ContainerDelete/', OD);
    }
}
