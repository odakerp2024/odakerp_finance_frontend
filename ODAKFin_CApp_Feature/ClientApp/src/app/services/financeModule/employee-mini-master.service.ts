import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';

@Injectable({
  providedIn: 'root'
})
export class EmployeeMiniMasterService {

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

  getEmployeeMiniMasterList(FormValue: any) {
    return this.http.post<any[]>(this.globals.APIURL + '/EmployeeMiniMaster/GetEmployeeMiniMasterList/',FormValue,  this.createAuthHeader());
  }

  getEmployeeById(FormValue: any) {
    return this.http.post<any[]>(this.globals.APIURL + '/EmployeeMiniMaster/GetEmployeeMiniMasterById/',FormValue,  this.createAuthHeader());
  }

  uploadEmployeeMiniMaster(FormValue) {
    return this.http.post<any[]>(this.globals.APIURL + '/EmployeeMiniMaster/UploadExcelFile/',FormValue,  this.createAuthHeader());
  }

}
