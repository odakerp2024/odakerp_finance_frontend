import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Country, City, MyAgency, Port, DynamicGrid } from 'src/app/model/common';
import { MyRateApproval, CntrTypeDetailsCharges, DynamicGridAttach, CommonValue } from 'src/app/model/RateApproval';
import { BusinessTypes, Party, DynamicGridParty, PartyAttachType, BranchList, GSTList, Currency, DynamicGridAcc, DynamicGridCr, DynamicGridAlert, DynamicGridVendorAcc } from 'src/app/model/Party';
import { Globals } from '../globals';

@Injectable({
    providedIn: 'root'
})
export class RateapprovalService {

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

    getPrincipleBind(OL: MyRateApproval): Observable<MyRateApproval[]> {

        return this.http.post<MyRateApproval[]>(this.globals.APIURL + '/rateapproval/BindPrinciples', OL);
    }
    getPortMasterBind(OL: Port): Observable<Port[]> {

        return this.http.post<Port[]>(this.globals.APIURL + '/PartyApi/PortMasterBind', OL);
    }
    getRouteTypesBind(OL: MyRateApproval): Observable<MyRateApproval[]> {

        return this.http.post<MyRateApproval[]>(this.globals.APIURL + '/rateapproval/BindRouteType', OL);
    }
    getDeliveryTermsBind(OL: MyRateApproval): Observable<MyRateApproval[]> {

        return this.http.post<MyRateApproval[]>(this.globals.APIURL + '/rateapproval/BindDeliveryTerms', OL);
    }
    getSalesPersonBind(OL: MyRateApproval): Observable<MyRateApproval[]> {

        return this.http.post<MyRateApproval[]>(this.globals.APIURL + '/rateapproval/BindSalesPersonList', OL);
    }
    getEnquirylistBind(OL: MyRateApproval): Observable<MyRateApproval[]> {

        return this.http.post<MyRateApproval[]>(this.globals.APIURL + '/rateapproval/BindEnquiry', OL);
    }
    getCargoTypes(OL: MyRateApproval): Observable<MyRateApproval[]> {

        return this.http.post<MyRateApproval[]>(this.globals.APIURL + '/rateapproval/BindCargoTypes', OL);
    }
    getExistEnquiryDetailsBind(OL: MyRateApproval): Observable<MyRateApproval[]> {

        return this.http.post<MyRateApproval[]>(this.globals.APIURL + '/rateapproval/ExistEnquiryDetailsBind', OL);
    }
    getExistEnquiryChargesEdit(OL: CntrTypeDetailsCharges): Observable<CntrTypeDetailsCharges[]> {

        return this.http.post<CntrTypeDetailsCharges[]>(this.globals.APIURL + '/rateapproval/ExistEnquiryChargesBind', OL);
    }

    RateApprovalSave(OD: MyRateApproval) {
        return this.http.post(this.globals.APIURL + '/rateapproval/RateApprovalSave/', OD);
    }
    SubmitCopyRR(OD: MyRateApproval) {
        return this.http.post(this.globals.APIURL + '/rateapproval/SubmitCopyRR/', OD);
    }

    getRateApprovalView(OL: MyRateApproval): Observable<MyRateApproval[]> {

        return this.http.post<MyRateApproval[]>(this.globals.APIURL + '/rateapproval/RateApprovalView', OL);
    }
    getRateApprovalEdit(OL: MyRateApproval): Observable<MyRateApproval[]> {

        return this.http.post<MyRateApproval[]>(this.globals.APIURL + '/rateapproval/RateApprovalEdit', OL);
    }
    getRRChargesEdit(OL: CntrTypeDetailsCharges): Observable<CntrTypeDetailsCharges[]> {

        return this.http.post<CntrTypeDetailsCharges[]>(this.globals.APIURL + '/rateapproval/RateApprovalChargesEdit', OL);
    }

    getRRAttachmentsView(OL: DynamicGridAttach): Observable<DynamicGridAttach[]> {

        return this.http.post<DynamicGridAttach[]>(this.globals.APIURL + '/rateapproval/RateApprovalAttachmentView', OL);
    }

    SubmitRateApproval(OD: MyRateApproval) {
        return this.http.post(this.globals.APIURL + '/rateapproval/SubmitRateApproval/', OD);
    }

    RejectRateApproval(OD: MyRateApproval) {
        return this.http.post(this.globals.APIURL + '/rateapproval/RejectRateApproval/', OD);
    }
    onCancelRateApproval(OD: MyRateApproval) {
        return this.http.post(this.globals.APIURL + '/rateapproval/onCancelRateApproval/', OD);
    }
    AttachDelete(OD: MyRateApproval) {

        return this.http.post(this.globals.APIURL + '/rateapproval/RRAttachDelete/', OD);
    }
    AttachUpload(file): Observable<any> {

        const formData = new FormData();
        formData.append("file", file, file.name);
        return this.http.post(this.globals.APIURL + '/rateapproval/upload/', formData)
    }
    getRejectDDBind(OL: CommonValue): Observable<CommonValue[]> {

        return this.http.post<CommonValue[]>(this.globals.APIURL + '/rateapproval/BindDDReject', OL);
    }
    getCancelDDBind(OL: CommonValue): Observable<CommonValue[]> {

        return this.http.post<CommonValue[]>(this.globals.APIURL + '/rateapproval/BindDDCancel', OL);
    }
    getRateApprovalOpenCount(OL: MyRateApproval): Observable<MyRateApproval[]> {

        return this.http.post<MyRateApproval[]>(this.globals.APIURL + '/rateapproval/RateApprovalOpenCount', OL);
    }

}
