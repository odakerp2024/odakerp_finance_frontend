import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';
import { Currency, CurrencySearch } from 'src/app/model/bankaccount';

@Injectable({
  providedIn: 'root'
})
export class PaymentReceivableService {

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

  upload(FormValue) {
    return this.http.post<any[]>(this.globals.APIURL + '/AccountsReceivable/UploadAccountsExcelFile',FormValue,  this.createAuthHeader());
  } 
  uploadTransJournal(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.FFAPI + '/Accounts/AddOpeningBalance', payload);
  }

  GetPaymentReceivableList(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/AccountsReceivable/GetAccountInvoiceList', FormValue);
  }
  getDivision(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL + '/Division/GetOrganizationDivisionList', payload);
  }
  getCurrencyLists(OL:CurrencySearch): Observable<Currency[]> {
    return this.http.post<Currency[]>(this.globals.APIURL + '/Dropdown/GetCurrency',OL);
  }
  getVendorList(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Vendor/GetVendorList/', this.createAuthHeader());
  }
}
