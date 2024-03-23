import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from 'src/app/globals';
import { Charges, chargesModel } from 'src/app/model/financeModule/ChargeCode';

@Injectable({
  providedIn: 'root'
})
export class ChargecodeService {


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

  getSAC(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/Dropdown/GetSAC/', FormValue);
  }

  getGSTGroup(FormValue: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/Dropdown/GetGSTGroup/', FormValue);
  }

  getDivision(): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetDivision/', this.createAuthHeader());
  }

  getGLLink(FormValue: any): Observable<any[]> {
    // return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetChargeChartOfAccounts/', this.createAuthHeader());
    return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetChargeChartOfAccounts/', FormValue);
  }

  getChargesList(FormValue: Charges): Observable<Charges[]> {
    return this.http.post<Charges[]>(this.globals.APIURL + '/Charges/GetChargesList/', {});
  }

  getChargesFilter(FormValue: Charges): Observable<Charges[]> {
    return this.http.post<Charges[]>(this.globals.APIURL + '/Charges/GetChargesFilter/', FormValue);
  }

  getChargesbyId(FormValue: any): Observable<Charges[]> {
    return this.http.post<Charges[]>(this.globals.APIURL + '/Charges/GetChargesId/', FormValue);
  }

  SaveCharges(FormValue: chargesModel) {
    return this.http.post(this.globals.APIURL + '/Charges/SaveCharges/', FormValue);
  }

  // DeleteEnqCntrType(OL: any): Observable<any[]> {
  //   return this.http.post<any[]>(this.globals.APIURL + '/enquiryApi/EnquiryCntrTypeDelete', OL, this.createAuthHeader());
  // }

  // bindExstingList(OL: any): Observable<any[]> {
  //   return this.http.post<any[]>(this.globals.APIURL + '/enquiryApi/EnquiryCntrTypeDelete', OL, this.createAuthHeader());
  // }

}

