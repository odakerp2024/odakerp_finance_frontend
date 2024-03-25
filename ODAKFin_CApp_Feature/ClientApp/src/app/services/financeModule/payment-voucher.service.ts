import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PaymentVoucher } from 'src/app/model/financeModule/paymentVoucher';
import { Globals } from 'src/app/globals';

@Injectable({
  providedIn: 'root'
})
export class PaymentVoucherService {
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

  getPaymentVoucher1(FormValue: PaymentVoucher): Observable<PaymentVoucher[]> {
    debugger;
    return this.http.post<PaymentVoucher[]>(this.globals.APIURL + '/Dropdown/GetPaymentVoucher', FormValue);
  }

  getPaymentVoucher(FormValue: any): Observable<PaymentVoucher[]> {
    return this.http.post<PaymentVoucher[]>(this.globals.APIURL + '/Dropdown/GetPaymentVoucher/', FormValue);
  }

  getPaymentVoucherList(FormValue: PaymentVoucher): Observable<PaymentVoucher[]> {
  
    return this.http.post<PaymentVoucher[]>(this.globals.APIURL + '/PaymentVouchers/GetPaymentVouchersList/', FormValue);
  }

  getPaymentVoucherFilter(FormValue: PaymentVoucher): Observable<PaymentVoucher[]> {
    return this.http.post<PaymentVoucher[]>(this.globals.APIURL + '/PaymentVouchers/GetPaymentVouchersFilter/', FormValue);
  }

  getPaymentVoucherbyId(FormValue: PaymentVoucher): Observable<PaymentVoucher[]> {
    
    return this.http.post<PaymentVoucher[]>(this.globals.APIURL + '/PaymentVouchers/GetPaymentVouchersId/', FormValue);
  }

  SavePaymentVoucher(FormValue: PaymentVoucher) {
    return this.http.post(this.globals.APIURL + '/PaymentVouchers/SavePaymentVouchers/', FormValue);
  }

}

