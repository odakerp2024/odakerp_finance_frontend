import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../globals';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class FNReportServiceService {

  constructor(public http: HttpClient, private globals: Globals) { }

  workFlowAPI = this.globals.SaApi;
  APIURL = this.globals.APIURL;

  getGSTOutputRegister(payload:any):Observable<any> {
    return this.http.post<any>(`${this.workFlowAPI}/FNReport/GSTOutputRegister`, payload);
  }

  getGSTInputRegister(payload:any):Observable<any> {
    return this.http.post<any>(`${this.workFlowAPI}/FNReport/GSTInputRegister`, payload);
  }

  getTDSPayableReport(payload:any):Observable<any> {
    return this.http.post<any>(`${this.workFlowAPI}/FNReport/TDSPayableReport`, payload);
  }

  async getGSTOutputRegisterExcel(FromDate: string, ToDate: string): Promise<Blob> {
    const url = `${this.workFlowAPI}/FNReport/GSTOutputRegisterExcel?FromDate=${FromDate}&&ToDate=${ToDate}`;
    return this.http.get(url, { responseType: 'blob' }).toPromise();
  }

  async getGSTInputRegisterExcel(FromDate: string, ToDate: string): Promise<Blob> {
    const url = `${this.workFlowAPI}/FNReport/GSTInputRegisterExcel?FromDate=${FromDate}&&ToDate=${ToDate}`;
    return this.http.get(url, { responseType: 'blob' }).toPromise();
  }

  async getTDSPayableExcel(FromDate: string, ToDate: string): Promise<Blob> {
    const url = `${this.workFlowAPI}/FNReport/GSTInputRegisterExcel?FromDate=${FromDate}&&ToDate=${ToDate}`;
    return this.http.get(url, { responseType: 'blob' }).toPromise();
  }

}
