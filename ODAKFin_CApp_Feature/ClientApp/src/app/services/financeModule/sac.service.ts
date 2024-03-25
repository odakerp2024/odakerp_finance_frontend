import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from 'src/app/globals';
import { SAC } from 'src/app/model/financeModule/SAC';


@Injectable({
  providedIn: 'root'
})
export class SacService {

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



  getSACList(FormValue: SAC): Observable<SAC[]> {
    return this.http.post<SAC[]>(this.globals.APIURL + '/SAC/GetSACList/', FormValue);
  }

  getSACFilter(FormValue: SAC): Observable<SAC[]> {
    return this.http.post<SAC[]>(this.globals.APIURL + '/SAC/GetSACFilter/', FormValue);
  }

  getSACbyId(FormValue: SAC): Observable<SAC[]> {
    return this.http.post<SAC[]>(this.globals.APIURL + '/SAC/GetSACId/', FormValue);
  }

  SaveSAC(FormValue: SAC) {
    return this.http.post(this.globals.APIURL + '/SAC/SaveSAC/', FormValue);
  }

}
