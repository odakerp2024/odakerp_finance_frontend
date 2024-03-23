import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { User } from 'oidc-client';
import { Globals } from '../globals';
import { Route } from '@angular/router';
import { logdata } from '../model/logdata';

@Injectable({
    providedIn: 'root'
})
export class LogdetailsService {

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
    getLogDetails(OL: logdata): Observable<logdata[]> {
        return this.http.post<logdata[]>(this.globals.APIURL + '/LogDetails/LogDetails', OL);
    }
    LogDataInsert(OL: logdata): Observable<logdata[]> {
        return this.http.post<logdata[]>(this.globals.APIURL + '/LogDetails/LogInsert', OL);
    }
}
