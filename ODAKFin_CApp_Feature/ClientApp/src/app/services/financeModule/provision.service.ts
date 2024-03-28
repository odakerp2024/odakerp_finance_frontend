import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';
import { Currency, CurrencySearch } from 'src/app/model/bankaccount';

@Injectable({
  providedIn: 'root'
})
export class ProvisionService {

  constructor(private http: HttpClient, private globals: Globals) { }

  GetProvisionList(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/Provision/GetProvisionList/', FormValue);
  }

  savePayment(FormValue){
    return this.http.post<any[]>(this.globals.APIURL + '/Provision/SaveProvisionInfo', FormValue);
  }
}
