import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';

@Injectable({
  providedIn: 'root'
})
export class RegionConfigurationService {

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


  getOfficeList(FormValue: any = {}): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL+ '/Office/GetOrganizationOfficeList', FormValue)
  }

  getDivisionList(FormValue: any = {}): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL+ '/Division/GetOrganizationDivisionList', FormValue)
  }

  gellAllRegionList(FormValue: any = {}): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL+ '/Division/GetOrganizationDivisionList', FormValue)
  }

  getReagionById(FormValue: any = {}): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL+ '/Division/GetOrganizationDivisionList', FormValue)

  }
}
