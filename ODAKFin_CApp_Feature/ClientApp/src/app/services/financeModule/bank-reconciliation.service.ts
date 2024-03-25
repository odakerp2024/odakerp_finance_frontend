import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';

@Injectable({
  providedIn: 'root'
})
export class BankReconciliationService {


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

  getBankReconciliation(payload): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/BankReconcile/GetBankReconcile', payload);
  }
  getBankUnreconcile(payload): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/BankReconcile/GetBankUnreconcile', payload);
  }
  UpdateBankReconcile(payload): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/BankReconcile/UpdateBankReconcile', payload);
  }
}
