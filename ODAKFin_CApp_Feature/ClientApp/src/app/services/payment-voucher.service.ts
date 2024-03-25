import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from '../globals';
import { Bankaccountlist, Currency, CurrencySearch } from '../model/bankaccount';

@Injectable({
  providedIn: 'root'
})
export class PaymentVoucherService {

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

  getFilterData(payload: any): Observable<any[]> {
      return this.http.post<any[]>(this.globals.APIURL + '/PaymentVoucher/GetPaymentVoucherFilter', payload);
  }

  getList(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/PaymentVoucher/GetPaymentVoucherList', payload);
  }

  getById(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/PaymentVoucher/GetPaymentVoucherId', payload);
  }

  getDivision(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL + '/Division/GetOrganizationDivisionList', payload);
  }

  getOffice(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL + '/Office/GetOrganizationOfficeList', payload);
  }

  getVendorPaymentById(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL + '/PaymentVoucher/GetPaymentVoucherId', payload);
  }
  /*Bankaccount */
  getBankAccountList(OL: Bankaccountlist): Observable<Bankaccountlist[]> {
    return this.http.post<Bankaccountlist[]>(this.globals.APIURL + '/Bank/GetBankList', OL);
  }

  getVendorList(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Vendor/GetVendorList/', this.createAuthHeader());
  }

  getCurrencyLists(OL:CurrencySearch): Observable<Currency[]> {
    return this.http.post<Currency[]>(this.globals.APIURL + '/Dropdown/GetCurrency',OL);
  }

  getModeOfPayment(payload){
    return this.http.post<Currency[]>(this.globals.APIURL + '/PaymentVoucher/GetModeOfPayment',payload);
  }

  getVendorId(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Vendor/GetVendorId/', FormValue);
  }

  savePayment(FormValue){
    return this.http.post<any[]>(this.globals.APIURL + '/PaymentVoucher/SaveVoucherInfo', FormValue);
  }

  getEntityDetails(FormValue){
    return this.http.post<any[]>(this.globals.APIURL + '/Organization/GetOrganizationEntityId', FormValue);
  }

  getExchangeRatePairs(FormValue){
    return this.http.post<any[]>(this.globals.APIURL + '/PaymentVoucher/GetCurrencyType', FormValue);
  }

  getInvoicePaymentList(FormValue) {
    return this.http.post<any[]>(this.globals.APIURL + '/PaymentVoucher/PaymentVoucherBillDuePaymentList', FormValue);
  }
}
