import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AppConfig, DocumentNumbering } from 'src/app/model/system';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
   /* readonly APIUrl = "https://localhost:44301/api";*/
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
   /*AppConfig*/
    getAppConfigList(OL: AppConfig): Observable<AppConfig[]> {

        return this.http.post<AppConfig[]>(this.globals.APIURL + '/System/GeneralMaster', OL, this.createAuthHeader());
    }
    getAppConfigEdit(OL: AppConfig): Observable<AppConfig[]> {
        return this.http.post<AppConfig[]>(this.globals.APIURL + '/System/GeneralMasteredit', OL);
    }

    saveAppConfig(OD: AppConfig) {

        return this.http.post(this.globals.APIURL + '/System/GeneralMasterInsert/', OD);
    }
    /*AppConfig*/

    /*DocumentNumbering*/
    getDocNumbList(OL: DocumentNumbering): Observable<DocumentNumbering[]> {

        return this.http.post<DocumentNumbering[]>(this.globals.APIURL + '/System/BLNoLogicsView', OL, this.createAuthHeader());
    }
    getDocNumbEdit(OL: DocumentNumbering): Observable<DocumentNumbering[]> {
        return this.http.post<DocumentNumbering[]>(this.globals.APIURL + '/System/BLNoLogicsEdit', OL);
    }
    saveDocNumb(OD: AppConfig) {

        return this.http.post(this.globals.APIURL + '/System/BLNoLogicsInsert/', OD);
    }

    //getNumbLogicList(OL: DocumentNumbering): Observable<DocumentNumbering[]> {

    //    return this.http.post<DocumentNumbering[]>(this.globals.APIURL + '/System/BLNoLogics', OL, this.createAuthHeader());
    //}
    getProgramChange(id): Observable<DocumentNumbering[]> {
      
        return this.http.get<DocumentNumbering[]>(this.globals.APIURL + '/System/BLNoLogics/'+ id, this.createAuthHeader());
    }
    /*DocumentNumbering*/
    
}
