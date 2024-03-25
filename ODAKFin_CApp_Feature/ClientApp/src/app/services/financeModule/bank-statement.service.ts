import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';

@Injectable({
  providedIn: 'root'
})
export class BankStatementService {

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

  uploadFile(payload): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/BankStatement/UploadExcelFile', payload);
  }

  getExcelUploadList(payload): Observable<any[]> {
    return this.http.post<any[]>(this.globals.APIURL + '/BankStatement/GetExcelUploadList', payload);
  }

  getBankTemplate(payload): Observable<any[]>{
    return this.http.post<any[]>(this.globals.APIURL+ '/BankStatement/GetStatementTemplateDetails', payload)
  }


}
