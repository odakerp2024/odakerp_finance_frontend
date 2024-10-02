import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class CreditApplicationService {
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

  getList(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/CreditApplication/GetCreditApplicationList', payload);
  }

  getById(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/CreditApplication/GetCreditApplicationById', payload);
  }


  saveCreditApplication(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/CreditApplication/SaveCreditApplicationInfo', payload);
  }

  getTradeList(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/CreditApplication/getTradeList', payload);
  }
  
  getCustomerCreditList(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Common/GetCustomerCreditList', payload);
  }

  getCustomerAndBranch(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Common/GetCustomerBranchList', payload)
  }

  getQuestionAndDropdown(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/CreditApplication/CreditApplicationDivisionList', payload)
  }

  getCreditApplicationDropdowns(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/CreditApplication/CreditApplicationDropdownList', payload)
  }
  
  getOffice(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL + '/Office/GetOrganizationOfficeList', payload);
  }
   
  getDivision(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL + '/Division/GetOrganizationDivisionList', payload);
  }
 
  getCustomerDropDownList(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL + '/Customer/GetCustomerDropDownList', payload);
  }
  getCustomerList(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Common/GetCustomerDropdownList', payload);
}


}
