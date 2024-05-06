import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';

@Injectable({
  providedIn: 'root'
})
export class ReportDashboardService {

  constructor(private http: HttpClient, private globals: Globals) { }

  GetReceiptVoucherReportList(FormValue: any): Observable<any> {
    FormValue.Amount = FormValue.Amount == '' ? 0 : FormValue.Amount;
    return this.http.post<any>(this.globals.APIURL + '/Reports/ReceiptVoucherList/', FormValue);
  }

  getVendorList(): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Vendor/GetVendorList/', {});
  }

  GetContraVoucherReportList(FormValue: any): Observable<any> {
    FormValue.Amount = FormValue.Amount == '' ? 0 : FormValue.Amount;
    return this.http.post<any>(this.globals.APIURL + '/Reports/ContraVoucherList/', FormValue);
  }


  getPaymentVoucherReportList(FormValue: any): Observable<any> {
    FormValue.Amount = FormValue.Amount == '' ? 0 : FormValue.Amount;
    return this.http.post<any>(this.globals.APIURL + '/Reports/PaymentVoucherList', FormValue);
  }

}
