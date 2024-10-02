import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Login } from 'src/app/model/common';
import { Globals } from '../globals';
import { MenuMasterData } from '../model/MenuMasterData';


@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient, private globals: Globals) { }


    getLoginList(OL: Login): Observable<Login[]> {
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
        return this.http.post<Login[]>(this.globals.APIURL + '/Home/Login', OL, { headers: reqHeader });
    }
    
    loginList(OL: any) {
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
        return this.http.post<any>(this.globals.APIURLFF + '/Login/ValidateLogin', OL, { headers: reqHeader });
    }

    getUserLoginList(payload: any) {
        return this.http.post<any>(this.globals.APIURLFF + '/Login/ValidateLogin/', payload);
    }
    getUserPermissionUpdateList(payload: any) {
        return this.http.post<any>(this.globals.APIURLFF + '/Login/GeneratePermissionObject_Update/', payload);
    }
    getUserPermissionCombinedList(payload: any) {
        return this.http.post<any>(this.globals.APIURLFF + '/Login/GetUserPermissionObjectCombinedRoles/', payload);
    }
    GetAllMenuList(payload: any): Observable<any> {
        return this.http.post<any>(this.globals.APIURLFF + '/Login/GetHeaderMenu', payload);
    }

    GetOverAllMenuList(payload: any): Observable<any> {
        return this.http.post<any>(this.globals.APIURLFF + '/Login/GetAllMenulist', payload);
    }

    GetUserPermissionObject(payload: any): Observable<any> {
        return this.http.post<any>(this.globals.APIURLLA + '/MenuMaster/UserPermissionObject', payload);
    }

    GetUserOffice(OL: MenuMasterData): Observable<MenuMasterData[]> {
        return this.http.post<any>(this.globals.APIURLLA + '/MenuMaster/UserRoleOffice', OL);
    }

    GetUserOfficeForViewList(UserID): Observable<MenuMasterData[]> {

        return this.http.get<MenuMasterData[]>(this.globals.APIURLLA + '/MenuMaster/GetUserOfficeForViewList/' + UserID);
    }

    GenerateUserPermissionObject(payload: any) {

        return this.http.post<any>(this.globals.APIURLFF + '/Login/GeneratePermissionObject/', payload);
    }

}


