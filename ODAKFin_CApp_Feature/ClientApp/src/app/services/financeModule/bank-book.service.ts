import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../../globals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankBookService {

  constructor(
    private http: HttpClient,
    private globals: Globals,
    private datePipe: DatePipe
  ) { }
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

  getBankBookDetails(OL): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/BankBook/GetBankBookDetails', OL);
  }

  bankBookDetailsFilter(OL): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/BankBook/GetBankBookFilter', OL);
  }
}
