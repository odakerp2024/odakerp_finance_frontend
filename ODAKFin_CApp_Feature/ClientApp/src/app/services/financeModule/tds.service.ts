import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from 'src/app/globals';
import { Section, TDSRate } from 'src/app/model/financeModule/TDS';

@Injectable({
  providedIn: 'root'
})
export class TDSService {

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

  getSection1(FormValue: Section): Observable<Section[]> {
    return this.http.post<Section[]>(this.globals.APIURL + '/Dropdown/GetSection', FormValue);
  }

  getSection(FormValue: any): Observable<Section[]> {
    return this.http.post<Section[]>(this.globals.APIURL + '/Dropdown/GetSection/', FormValue);
  }

  getTDSList(FormValue: TDSRate): Observable<TDSRate[]> {

    return this.http.post<TDSRate[]>(this.globals.APIURL + '/TDSRates/GetTDSRatesList/', FormValue);
  }

  getTDSFilter(FormValue: TDSRate): Observable<TDSRate[]> {
    return this.http.post<TDSRate[]>(this.globals.APIURL + '/TDSRates/GetTDSRatesFilter/', FormValue);
  }

  getTDSbyId(FormValue: TDSRate): Observable<TDSRate[]> {

    return this.http.post<TDSRate[]>(this.globals.APIURL + '/TDSRates/GetTDSRatesId/', FormValue);
  }

  SaveTDS(FormValue: TDSRate) {
    return this.http.post(this.globals.APIURL + '/TDSRates/SaveTDSRates/', FormValue);
  }

}
