import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from '../globals';
import { CRODynamicGrid, MyCro } from '../model/cro';

@Injectable({
  providedIn: 'root'
})
export class CroService {

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

    getStuffList(OL: MyCro): Observable<MyCro[]> {

        return this.http.post<MyCro[]>(this.globals.APIURL + '/cro/BindStufflist', OL);
    }

    getDepoList(OL: MyCro): Observable<MyCro[]> {

        return this.http.post<MyCro[]>(this.globals.APIURL + '/cro/BindDepolist', OL);
    }
    getExistingBkgCntrTypeNos(OL: CRODynamicGrid): Observable<CRODynamicGrid[]> {

        return this.http.post<CRODynamicGrid[]>(this.globals.APIURL + '/cro/BkgExistingCntrTypesViewRecord', OL);
    }
    viewCROList(OL: MyCro): Observable<MyCro[]> {

        return this.http.post<MyCro[]>(this.globals.APIURL + '/cro/CROViewRecord', OL);
    }
    
    SaveCro(OD: MyCro) {
        return this.http.post(this.globals.APIURL + '/cro/CroSave/', OD);
    }
    ExistingCROBind(OL: MyCro): Observable<MyCro[]> {

        return this.http.post<MyCro[]>(this.globals.APIURL + '/cro/CROEdit', OL);
    }
    getExistingCROCntrTypeNos(OL: CRODynamicGrid): Observable<CRODynamicGrid[]> {

        return this.http.post<CRODynamicGrid[]>(this.globals.APIURL + '/cro/ExistCROCntrTypesNos', OL);
    }
    CROValidations(OL: MyCro): Observable<MyCro[]> {

        return this.http.post<MyCro[]>(this.globals.APIURL + '/cro/CROValidations', OL);
    }

} 
