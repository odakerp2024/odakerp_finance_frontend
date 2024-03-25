import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from 'src/app/globals';
import { CurrencyPair, ExchangeRate } from 'src/app/model/financeModule/ExchangeRate';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

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


  getCurrencyPair(): Observable<CurrencyPair[]> {
    let queryParams = { "currencyPairID": 0 };
    //queryParams = queryParams.append("currencyPairID", FormValue.CurrencyPairId);

    return this.http.post<CurrencyPair[]>(this.globals.APIURL + '/Dropdown/GetCurrencyPair/', queryParams);
  }

  getExchangeRateList(FormValue: ExchangeRate): Observable<ExchangeRate[]> {
    return this.http.post<ExchangeRate[]>(this.globals.APIURL + '/ExchangeRate/GetExchangeRate/', { exchangeRateID: 0 });
  }

  getExchangeRateFilter(FormValue: any): Observable<ExchangeRate[]> {
    return this.http.post<ExchangeRate[]>(this.globals.APIURL + '/ExchangeRate/GetExchangeRatePairFilters', FormValue);
  }

  getExchangeRatebyId(FormValue: any): Observable<ExchangeRate[]> {
    return this.http.post<ExchangeRate[]>(this.globals.APIURL + '/ExchangeRate/GetExchangeRateId/', FormValue);
  }

  SaveExchangeRate(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/ExchangeRate/SaveExchangeRate/', FormValue);
  }

}
