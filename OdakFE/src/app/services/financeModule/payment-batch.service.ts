import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';
import { Currency, CurrencySearch } from 'src/app/model/bankaccount';

@Injectable({
  providedIn: 'root'
})
export class PaymentBatchService {

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
  

  GetPaymentBatchOpenRequestList(FormValue: any): Observable<any> { 
    return this.http.post<any>(this.globals.APIURL + '/paymentBatch/GetPaymentBatchOpenRequestList/', FormValue);
  }

  GetPaymentBatchInProgresstList(FormValue: any): Observable<any> { 
    return this.http.post<any>(this.globals.APIURL + '/paymentBatch/GetPaymentBatchInProgressList/', FormValue);
  }  

  GetPaymentBatchCloseRequestList(FormValue: any): Observable<any> { 
    return this.http.post<any>(this.globals.APIURL + '/paymentBatch/GetPaymentBatchClosedPaymentsList', FormValue);
  }
  SavePaymentBatch(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/paymentBatch/SavePaymentBatchOpenRequest/', FormValue);
  }

  UpdatePaymentBatchInProgresstList(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/paymentBatch/SavePaymentVoucherFromPaymentBatch/', FormValue);
  }

  ReverseInProgressInvoice(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/paymentBatch/PaymentBatchReverse/', FormValue);
  }

  SavePaymentBatchInvoieWise(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/paymentBatch/SavePaymentBatchOpenRequestInvoiceWise/', FormValue);
  }

  GetPaymentRequestById(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/PaymentRequest/GetPaymentRequestById/', FormValue);
  }

  SavePaymentRequest(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/PaymentRequest/SavePaymentRequest/', FormValue);
  }

  getPaymentRequestInvoiceList(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/PaymentRequest/PaymentRequestInvoiceList/', FormValue);
  }

  getModeOfPayment(payload){
    return this.http.post<Currency[]>(this.globals.APIURL + '/PaymentVoucher/GetModeOfPayment',payload);
  }

  getCurrencyLists(OL:CurrencySearch): Observable<Currency[]> {
    return this.http.post<Currency[]>(this.globals.APIURL + '/Dropdown/GetCurrency',OL);
  }

  getDropdown(FormValue: any): Observable<any> {
    return this.http.post<Currency[]>(this.globals.APIURL + '/PaymentRequest/PaymentRequestDropdownList/',FormValue);
  }

}
