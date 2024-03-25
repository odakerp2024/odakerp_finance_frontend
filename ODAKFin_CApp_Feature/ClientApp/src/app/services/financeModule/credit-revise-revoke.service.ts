import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';

@Injectable({
  providedIn: 'root'
})
export class CreditReviseRevokeService {

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

  getByReviewId(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/CreditReviseAndRevoke/GetReviseAndRevokeById/', FormValue );
  }



  getListAndFilter(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/CreditReviseAndRevoke/GetCreditReviseAndRevokeList/', FormValue );
  }

  SaveReviseAndRevoke(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/CreditReviseAndRevoke/SaveCreditReviseAndRevoke', FormValue );
  }

  getById(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/CreditReviseAndRevoke/GetCreditReviseAndRevokeById', FormValue );
  }


  getDropdown(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/CreditReviseAndRevoke/GetCreditReviseAndRevokeDropdownList/', FormValue);
  }

  getSalesPerson(FormValue: any) {
    return this.http.post(this.globals.APIURL + '/CreditReviseAndRevoke/GetReviseAndRevokeSalesPersonList/', FormValue);
  }

  getQuestionAndDropdown(payload: any): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/CreditApplication/CreditApplicationDivisionList', payload)
  }


}
