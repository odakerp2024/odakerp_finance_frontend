import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})

export class ReceiptvoucherService {

  constructor(private http: HttpClient, private globals: Globals) { }

    getReceiptVoucherList(FormValue: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/ReceiptVoucher/GetReceiptVoucherList/', FormValue);
    }

    getReceiptVoucherDetails(FormValue: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/ReceiptVoucher/GetReceiptVoucherDetails/', FormValue);
    }

    saveReceiptvoucher(FormValue: any): Observable<any[]> {
        debugger;
        return this.http.post<any[]>(this.globals.APIURL + '/ReceiptVoucher/InsertOrUpdateReceiptVoucher/', FormValue);
    }

}
