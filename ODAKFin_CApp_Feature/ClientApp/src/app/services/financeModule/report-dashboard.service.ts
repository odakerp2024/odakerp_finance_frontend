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
    return this.http.post<any>(this.globals.APIURL + '/Reports/ReceiptVoucherList/', FormValue);
  }
}
