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
  getAccountPayableList(FormValue: any): Observable<any> {
    FormValue.Amount = FormValue.Amount == '' ? 0 : FormValue.Amount;
    return this.http.post<any>(this.globals.APIURL + '/Reports/AccountPayableList', FormValue);
  }
 
  getVoucherReversalReportList(FormValue: any): Observable<any> {
    FormValue.Amount = FormValue.Amount == '' ? 0 : FormValue.Amount;
    return this.http.post<any>(this.globals.APIURL + '/Reports/VoucherReversalList/', FormValue);
  }

  getSalesVoucherReportList(FormValue: any): Observable<any> {
    FormValue.Amount = FormValue.Amount == '' ? 0 : FormValue.Amount;
    return this.http.post<any>(this.globals.APIURL + '/Reports/SalesVoucherList', FormValue);
  }
  
  
  getJournalVoucherReportList(FormValue: any): Observable<any> {
    FormValue.Amount = FormValue.Amount == '' ? 0 : FormValue.Amount;
    return this.http.post<any>(this.globals.APIURL + '/Reports/JournalVoucherList', FormValue);
  }

  getAdjustmentReportList(FormValue: any): Observable<any> {
    FormValue.Amount = FormValue.Amount == '' ? 0 : FormValue.Amount;
    return this.http.post<any>(this.globals.APIURL + '/Reports/AdjustmentVoucherList', FormValue);
  }
  
  getPurchaseVoucherReportList(FormValue: any): Observable<any> {
    FormValue.Amount = FormValue.Amount == '' ? 0 : FormValue.Amount;
    return this.http.post<any>(this.globals.APIURL + '/Reports/PurchaseVoucherList', FormValue);
  }

  // Account Receivable Balance Summary Services 
    
  getBalanceSummaryList(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/Reports/AccountReceivableList', FormValue);
  }


   // Account Receivable Aging Summary Services 
    
   getAgingSummaryList(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/Reports/AccountReceivableAgingList', FormValue);
  }

  // Account Receivable Sales Summary Services 

  getSalesPersonDropdowns(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/CreditApplication/CreditApplicationDropdownList', payload)
  }
}
