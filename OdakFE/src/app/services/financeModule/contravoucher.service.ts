import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ContraVoucher } from 'src/app/model/financeModule/ContraVoucher';
import { Globals } from 'src/app/globals';

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

  getContraVoucher1(FormValue: ContraVoucher): Observable<ContraVoucher[]> {
    debugger;
    return this.http.post<ContraVoucher[]>(this.globals.APIURL + '/Dropdown/GetContraVoucher', FormValue);
  }

  getContraVoucher(FormValue: any): Observable<ContraVoucher[]> {
    return this.http.post<ContraVoucher[]>(this.globals.APIURL + '/Dropdown/GetContraVoucher/', FormValue);
  }

  getContraVoucherList(FormValue: ContraVoucher): Observable<ContraVoucher[]> {
  
    return this.http.post<ContraVoucher[]>(this.globals.APIURL + '/ContraVouchers/GetContraVouchersList/', FormValue);
  }

  getContraVoucherFilter(FormValue: ContraVoucher): Observable<ContraVoucher[]> {
    return this.http.post<ContraVoucher[]>(this.globals.APIURL + '/ContraVouchers/GetContraVouchersFilter/', FormValue);
  }

  getContraVoucherbyId(FormValue: ContraVoucher): Observable<ContraVoucher[]> {
    
    return this.http.post<ContraVoucher[]>(this.globals.APIURL + '/ContraVouchers/GetContraVouchersId/', FormValue);
  }

  SaveContraVoucher(FormValue: ContraVoucher) {
    return this.http.post(this.globals.APIURL + '/ContraVouchers/SaveContraVouchers/', FormValue);
  }

}

