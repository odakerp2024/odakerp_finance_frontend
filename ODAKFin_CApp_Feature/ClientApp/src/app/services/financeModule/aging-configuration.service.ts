import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';

@Injectable({
  providedIn: 'root'
})
export class AgingConfigurationService {
  authToken: string = '';

  constructor(private http: HttpClient, private globals: Globals) { }


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

  getAllAgingList(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/AgingConfiguration/GetReportAgingList', FormValue);
  }

  getDropdownList(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/AgingConfiguration/GetReportAgingDropDownList', FormValue);
  }

  getAgingById(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/AgingConfiguration/GetReportAgingById/', FormValue); 
  }

  saveAging(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/AgingConfiguration/SaveReportAgingInfo', FormValue);
  }

  addAgingGroupDropdown(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/AgingConfiguration/SaveAgingGroupInfo', FormValue)
  }

  deleteAgingGroupDropdown(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/AgingConfiguration/DeleteReportAgingInfo', FormValue)
  }

  tableDelete(FormValue: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/AgingConfiguration/DeleteAgingGroupInfo', FormValue)

  }

}
