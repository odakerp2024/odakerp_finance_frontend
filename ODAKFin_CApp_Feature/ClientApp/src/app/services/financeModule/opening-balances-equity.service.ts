import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';
import { Currency, CurrencySearch } from 'src/app/model/bankaccount';

@Injectable({
  providedIn: 'root'
})
export class OpeningBalancesEquityService {

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

  upload(FormValue) {
    return this.http.post<any[]>(this.globals.APIURL + '/OpeningBalanceEquity/UploadEquityExcel',FormValue,  this.createAuthHeader());
  }

  GetEquityList(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/OpeningBalanceEquity/GetEquityList', FormValue);
  }
}


