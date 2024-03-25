import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from 'src/app/globals';
import { SAC } from 'src/app/model/financeModule/SAC';

import { Section } from 'src/app/model/financeModule/TDS';

@Injectable({
  providedIn: 'root'
})
export class ChartaccountService {

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

  getChartOfAccountCode(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/ChartOfAccounts/GetChartOfAccountCode/', FormValue);
  }

  getChartaccountList(FormValue: any): Observable<SAC[]> {
    return this.http.post<SAC[]>(this.globals.APIURL + '/ChartOfAccounts/GetChartOfAccountsList/', FormValue);
  }

  getChartaccountFilter(FormValue: any): Observable<SAC[]> {
    return this.http.post<SAC[]>(this.globals.APIURL + '/ChartOfAccounts/GetChartOfAccountsFilter/', FormValue);
  }

  getChartaccountbyId(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/ChartOfAccounts/GetChartOfAccountsId/', FormValue);
  }

  SaveChartaccount(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/ChartOfAccounts/SaveChartOfAccounts/', FormValue);
  }

  getAccountType(): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetSubAccountGroup/', this.createAuthHeader());
  }

  getMainAccountGroup(): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetMainAccountGroup/', this.createAuthHeader());
  }

  getParentAccount(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/ChartOfAccounts/GetChartAccountName/', FormValue);
  }

  getDivision(): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetDivision/', this.createAuthHeader());
  }

  getPrincipal(FormValue: any) {
    //return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetDivision/', this.createAuthHeader());
    return this.http.post(this.globals.APIURL + '/Dropdown/GetPrincipal/', FormValue);
  }
 
  getAccount(FormValue: any) {
    //Account Name for grid 
    return this.http.post(this.globals.APIURL + '/AdjustmentVoucher/AdjustmentVoucherDropdown', FormValue);
  }


}
