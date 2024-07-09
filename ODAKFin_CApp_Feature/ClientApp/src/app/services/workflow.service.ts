import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  
    constructor(public http: HttpClient, private globals: Globals) { }

    workFlowAPI = this.globals.SaApi;
    APIURL = this.globals.APIURL;

     getWorkflowParams(workflowKey:string): Observable<any> {
      return this.http.get(`${this.workFlowAPI}/Workflowengineparameter/${workflowKey}`);
    }
    workflowTrigger(payload:any):Observable<any> {
      return this.http.post<any>(`${this.workFlowAPI}/WorkflowEngineTriger`, payload);
    }
   
    getWorkflowInbox(payload:any):Observable<any> {
      return this.http.get<any>(`${this.workFlowAPI}/Workflowenginestatusinbox/${payload.userEmail}/${payload.wfnumber}/${payload.eventnumber}/${payload.fromdate}/${payload.tilldate}/${payload.event_value}/${payload.customername}/${payload.status}`);
    }

    getWorkflowDetails(payload:any):Observable<any> {
      return this.http.get<any>(`${this.workFlowAPI}/Workflowengineprogress/${payload}`);
    }

    updateWorkflowStatus(payload:any):Observable<any> {
      return this.http.post<any>(`${this.workFlowAPI}/Workflowengineapprove`, payload);
    }

    getUserDtls(payload:any):Observable<any> {
      return this.http.post<any>(`${this.APIURL}/User/GetUserDtls/`, payload);
    }

    getwfEventList(payload:any):Observable<any> {
      return this.http.post<any>(`${this.workFlowAPI}/WorkflowEngineHistoryInbox/WFEventList/`, payload);
    }




    CustomerConfirm(payload:any):Observable<any> {
      return this.http.post<any>(`${this.APIURL}/User/CustomerBranchConfirmUpdate/`, payload);
    }

    vendorConfirm(payload:any):Observable<any> {
      return this.http.post<any>(`${this.APIURL}/User/VendorBranchConfirmUpdate/`, payload);
    }

    KYCValidation(payload:any):Observable<any> {
      return this.http.post<any>(`${this.APIURL}/User/CustomerBranchKYCValidation/`, payload);
    }

    venKYCValidation(payload:any):Observable<any> {
      return this.http.post<any>(`${this.APIURL}/User/VendorBranchKYCValidation/`, payload);
    }

    CreditAppConfirm(payload:any):Observable<any> {
      return this.http.post<any>(`${this.APIURL}/User/CreditAppConfirmUpdate/`, payload);
    }

    CustomerMailTrigger(payload:any):Observable<any> {
      return this.http.post<any>(`${this.APIURL}/EmailNotifications/CustomerNotificationEmailSend/`, payload);
    }

    VendorMailTrigger(payload:any):Observable<any> {
      return this.http.post<any>(`${this.APIURL}/EmailNotifications/VendorNotificationEmailSend/`, payload);
    }

    CreditAppNewMailTrigger(payload:any):Observable<any> {
      return this.http.post<any>(`${this.APIURL}/EmailNotifications/CreditAppNewMailSend/`, payload);
    }

}
