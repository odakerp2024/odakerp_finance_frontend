import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from 'src/app/globals';
import { DivisionTypes } from 'src/app/model/financeModule/Vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

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


  getVendorList(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Vendor/GetVendorList/', this.createAuthHeader());
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

  getVendorFilter(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Vendor/GetVendorFilter/', FormValue);
  }

  getVendorId(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Vendor/GetVendorId/', FormValue);
  }

  generateVendorCode(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Vendor/GenerateVendorCode/', FormValue);
  }

  getVendorEmailHistory(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Vendor/GetVendorEmailHistory/', FormValue);
  }

  getBusinessDivision(OL: DivisionTypes): Observable<DivisionTypes[]> {
    return this.http.post<DivisionTypes[]>(this.globals.APIURL + '/Dropdown/GetDivision', OL);
  }

  getDITReason(): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetDITReason/', this.createAuthHeader());
  }

  GetTDSApplicability(): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetTDSApplicability/', this.createAuthHeader());
  }
  getReasonForNonTDS(): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetReasonForNonTDS/', this.createAuthHeader());
  }

  SaveVendor(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/Vendor/SaveVendor/', FormValue);
  }

  getOnboardingStatus(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/Customer/GetOnBoardList/',FormValue);
  }
  getGstCategory(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/Customer/GetGSTCategory/', FormValue);
  }

  getCoaType(FormValue: any){
    return this.http.post(this.globals.APIURL + '/ChartOfAccounts/GetChartOfAccountsList/', FormValue);
  }

  saveRelatedParty(partyValue : any){
    return this.http.post(this.globals.APIURL + '/Vendor/SaveVendorRelated/', partyValue);
  }

  getRelatedVendor(partyValue: any){
    return this.http.post(this.globals.APIURL + '/Vendor/GetRelatedVendor/', partyValue);
  }

  deleteRelatedVendor(partyValue: any) {
    return this.http.post(this.globals.APIURL + '/Vendor/DeleteVendorRelated/', partyValue);
  }

  getTDSReason(partyValue: any){
    return this.http.post(this.globals.APIURL + '/Vendor/GetTDSReasonVendor/', partyValue);
  }

  getPayableSubCategory(partyValue: any) {
    return this.http.post(this.globals.APIURL + '/Vendor/GetPayableVendor/', partyValue);
  }
  getVendorSectionRate(partyValue: any) {
    return this.http.post(this.globals.APIURL + '/Vendor/GetVendorTDSSectionList', partyValue);
  }

}
