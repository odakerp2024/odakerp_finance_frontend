import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from 'src/app/globals';
import { Observable } from 'rxjs/internal/Observable';
import { FinancialYearList } from 'src/app/model/financeModule/Financialyear';

@Injectable({
  providedIn: 'root'
})
export class FinancialyearService {

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

  getFinancialYear(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/Dropdown/GetFinancialYear/', FormValue);
  }

  getFinancialYearList(FormValue: FinancialYearList): Observable<FinancialYearList[]> {
    return this.http.post<FinancialYearList[]>(this.globals.APIURL + '/FinancialYear/GetFinancialYearList/', FormValue);
  }

  getFinancialYearFilter(FormValue: FinancialYearList): Observable<FinancialYearList[]> {
    return this.http.post<FinancialYearList[]>(this.globals.APIURL + '/FinancialYear/GetFinancialYearFilter/', FormValue);
  }

  getFinancialYearbyId(FormValue: FinancialYearList): Observable<FinancialYearList[]> {
    return this.http.post<FinancialYearList[]>(this.globals.APIURL + '/FinancialYear/GetFinancialYearId/', FormValue);
  }

  SaveFinancialYear(FormValue: FinancialYearList) {
    return this.http.post(this.globals.APIURL + '/FinancialYear/SaveFinancialYear/', FormValue);
  }

}
