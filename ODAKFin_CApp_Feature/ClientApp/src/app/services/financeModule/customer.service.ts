import { Injectable } from '@angular/core';
import { Globals } from 'src/app/globals';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DivisionTypes } from 'src/app/model/financeModule/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

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


  getCustomerList(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Customer/GetCustomerList/', this.createAuthHeader());
  }

  getAgreement(): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetAgreement/', this.createAuthHeader());
  }

  getCustomerStatus(): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetCustomerStatus/', this.createAuthHeader());
  }

  getCurrency(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetCurrency/', FormValue);
  }

  getCustomerFilter(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Customer/GetCustomerFilter/', FormValue);
  }

  getCustomerId(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Customer/GetCustomerId/', FormValue);
  }

  getCustomerBranchDuplicate(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Customer/getCustomerBranchcheck/', FormValue);
  }

  generateCustomerCode(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Customer/GenerateCustomerCode/', FormValue);
  }

  getCustomerEmailHistory(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Customer/GetCustomerEmailHistory/', FormValue);
  }

  getBusinessDivision(OL: DivisionTypes): Observable<DivisionTypes[]> {
    return this.http.post<DivisionTypes[]>(this.globals.APIURL + '/Dropdown/GetDivision', OL);
  }
  SaveCustomer(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/Customer/SaveCustomer/', FormValue);
  }  

  getCustomerCreditList(OL): Observable<any> {
    return this.http.post<DivisionTypes[]>(this.globals.APIURL + '/Customer/CustomerCreditDetailsList', OL);
  }
} 