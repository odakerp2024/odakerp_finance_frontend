import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { MyDivision, MyUsers } from 'src/app/model/Admin';
import { User } from 'oidc-client';
import { Globals } from '../globals';
@Injectable({
    providedIn: 'root'
})
export class AdminService {

    /*readonly APIUrl = "https://localhost:44301/api";*/
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

    getDivisionList(): Observable<MyDivision[]> {

        return this.http.post<MyDivision[]>(this.globals.APIURL + '/UserApi/Division', this.createAuthHeader());
    }
    getDepartmentList(): Observable<MyDivision[]> {

        return this.http.post<MyDivision[]>(this.globals.APIURL + '/UserApi/Department', this.createAuthHeader());
    }
    getDesignationList(): Observable<MyDivision[]> {

        return this.http.post<MyDivision[]>(this.globals.APIURL + '/UserApi/Designation', this.createAuthHeader());
    }
    getBranchList(): Observable<MyDivision[]> {

        return this.http.post<MyDivision[]>(this.globals.APIURL + '/Home/cityBind', this.createAuthHeader());
    }

    SaveUserList(OL: MyUsers): Observable<MyUsers[]> {

        return this.http.post<MyUsers[]>(this.globals.APIURL + '/UserApi/InsertUser', OL, this.createAuthHeader());
    }

    getUserList(OL: MyUsers): Observable<MyUsers[]> {

        return this.http.post<MyUsers[]>(this.globals.APIURL + '/UserApi/UserView', OL, this.createAuthHeader());
    }

    getUserExisting(OL: MyUsers): Observable<MyUsers[]> {

        return this.http.post<MyUsers[]>(this.globals.APIURL + '/UserApi/UserViewRecord', OL);
    }
    getOfficeLocationEidt(OL: MyUsers): Observable<MyUsers[]> {

        return this.http.post<MyUsers[]>(this.globals.APIURL + '/UserApi/OfficeLocationEidt', OL);
    }

    getOfficeDelete(OL: MyUsers): Observable<MyUsers[]> {

        return this.http.post<MyUsers[]>(this.globals.APIURL + '/UserApi/OfficeLocationDelete', OL);
    }

}
