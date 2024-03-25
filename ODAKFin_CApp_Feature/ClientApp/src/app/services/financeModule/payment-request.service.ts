import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';
import { Currency, CurrencySearch } from 'src/app/model/bankaccount';

@Injectable({
  providedIn: 'root'
})
export class PaymentRequestService {

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

  GetPaymentRequestList(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/PaymentRequest/GetPaymentRequestList/', FormValue);
  }

  GetPaymentRequestById(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/PaymentRequest/GetPaymentRequestById/', FormValue);
  }

  SavePaymentRequest(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/PaymentRequest/SavePaymentRequest/', FormValue);
  }

  getPaymentRequestInvoiceList(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/PaymentRequest/PaymentRequestInvoiceList/', FormValue);
  }

  getModeOfPayment(payload){
    return this.http.post<Currency[]>(this.globals.APIURL + '/PaymentVoucher/GetModeOfPayment',payload);
  }

  getCurrencyLists(OL:CurrencySearch): Observable<Currency[]> {
    return this.http.post<Currency[]>(this.globals.APIURL + '/Dropdown/GetCurrency',OL);
  }

  getDropdown(FormValue: any): Observable<any> {
    return this.http.post<Currency[]>(this.globals.APIURL + '/PaymentRequest/PaymentRequestDropdownList/',FormValue);
  }

  getOffice(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL + '/Office/GetOrganizationOfficeList', payload);
  }
   
  getDivision(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL + '/Division/GetOrganizationDivisionList', payload);
  }


}
