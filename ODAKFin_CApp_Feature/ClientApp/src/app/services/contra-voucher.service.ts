import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../globals';
import { Observable } from 'rxjs';
import { BankFilter, Bankaccountlist, Currency, CurrencySearch } from '../model/bankaccount';

@Injectable({
  providedIn: 'root'
})
export class ContraVoucherService {

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
    return this.http.post<any[]>(this.globals.APIURL + '/ContraVoucher/GetContraVoucherList', payload);
  }

  getById(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/ContraVoucher/GetContraVoucherId', payload);
  }

  saveContra(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/ContraVoucher/SaveContraVoucher', payload);
  }

  getDivision(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL + '/Division/GetOrganizationDivisionList', payload);
  }

  getOffice(payload: any): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL + '/Office/GetOrganizationOfficeList', payload);
  }

  getCurrencyLists(OL:CurrencySearch): Observable<Currency[]> {
    return this.http.post<Currency[]>(this.globals.APIURL + '/Dropdown/GetCurrency',OL);
  }

  getModeOfPayment(payload){
    return this.http.post<Currency[]>(this.globals.APIURL + '/PaymentVoucher/GetModeOfPayment',payload);
  }

    /*Bankaccount */
  getBankAccountList(OL: Bankaccountlist): Observable<Bankaccountlist[]> {
    return this.http.post<Bankaccountlist[]>(this.globals.APIURL + '/Bank/GetBankList', OL);
  }

  contraFilter(payload: any): Observable<any[]> {
    return this.http.post<any>(this.globals.APIURL + '/ContraVoucher/GetContraVoucherFilter', payload);
  }

  getEntityDetails(FormValue){
    return this.http.post<any[]>(this.globals.APIURL + '/Organization/GetOrganizationEntityId', FormValue);
  }
  
  getExchangeRatePairs(FormValue){
    return this.http.post<any[]>(this.globals.APIURL + '/PaymentVoucher/GetCurrencyType', FormValue);
  }
  getbankaccountFilter(OL: BankFilter): Observable< BankFilter[]> {
    return this.http.post< BankFilter[]>(this.globals.APIURL + '/Bank/GetBankFilter', OL);
}

}
