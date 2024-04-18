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
    //APIURL = this.globals.APIURLlocal;

     getWorkflowParams(workflowKey:string): Observable<any> {
      return this.http.get(`${this.workFlowAPI}/Workflowengineparameter/${workflowKey}`);
    }
    workflowTrigger(payload:any):Observable<any> {
      return this.http.post<any>(`${this.workFlowAPI}/WorkflowEngineTriger`, payload);
    }
   
    getWorkflowInbox(payload:any):Observable<any> {
      return this.http.get<any>(`${this.workFlowAPI}/Workflowenginestatusinbox/${payload.userEmail}`);
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




    CustomerConfirm(payload:any):Observable<any> {
      return this.http.post<any>(`${this.APIURL}/User/CustomerBranchConfirmUpdate/`, payload);
    }

    KYCValidation(payload:any):Observable<any> {
      return this.http.post<any>(`${this.APIURL}/User/CustomerBranchKYCValidation/`, payload);
    }

}
