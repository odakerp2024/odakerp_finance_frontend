import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from '../globals';
import { BookingMaster } from '../model/booking';
import { MyBkgLevel, MyBkgDocs } from '../model/MyBkgLevel';
@Injectable({
    providedIn: 'root'
})
export class BkglevelService {

    constructor(private http: HttpClient, private globals: Globals) { }

    BkgLevelBolListView(OL: MyBkgLevel): Observable<MyBkgLevel[]> {

        return this.http.post<MyBkgLevel[]>(this.globals.APIURL + '/BkgLevel/BkgLevelBolListView', OL);
    }
    viewBookinglevelList(OL: MyBkgLevel): Observable<MyBkgLevel[]> {

        return this.http.post<MyBkgLevel[]>(this.globals.APIURL + '/BkgLevel/BkgLevelVesselListView', OL);
    }
    viewBkglevelTaskSearch(OL: MyBkgLevel): Observable<MyBkgLevel[]> {

        return this.http.post<MyBkgLevel[]>(this.globals.APIURL + '/BkgLevel/BkgLevelTaskSearchView', OL);
    }
    getBookingNoList(OL: MyBkgLevel): Observable<MyBkgLevel[]> {

        return this.http.post<MyBkgLevel[]>(this.globals.APIURL + '/BkgLevel/BindBookingNoList', OL);
    }
    getBLNoList(OL: MyBkgLevel): Observable<MyBkgLevel[]> {

        return this.http.post<MyBkgLevel[]>(this.globals.APIURL + '/BkgLevel/BindBLNoList', OL);
    }
    getBkgPartyList(OL: MyBkgLevel): Observable<MyBkgLevel[]> {

        return this.http.post<MyBkgLevel[]>(this.globals.APIURL + '/BkgLevel/BindBkgPartyList', OL);
    }
    getVesselVoyList(OL: MyBkgLevel): Observable<MyBkgLevel[]> {

        return this.http.post<MyBkgLevel[]>(this.globals.APIURL + '/BkgLevel/BindVesselVoyList', OL);
    }
    getUserDetails(OL: MyBkgLevel): Observable<MyBkgLevel[]> {

        return this.http.post<MyBkgLevel[]>(this.globals.APIURL + '/BkgLevel/BindUserDetails', OL);
    }
    getCntrNoList(OL: MyBkgLevel): Observable<MyBkgLevel[]> {

        return this.http.post<MyBkgLevel[]>(this.globals.APIURL + '/BkgLevel/BindCntrNos', OL);
    }

    //---Docs--//
    getDocsHazlist(OL: MyBkgDocs): Observable<MyBkgDocs[]> {

        return this.http.post<MyBkgDocs[]>(this.globals.APIURL + '/BkgLevel/ViewDocsHazlist', OL);
    }
    AttachUpload(file): Observable<any> {

        const formData = new FormData();
        formData.append("file", file, file.name);
        return this.http.post(this.globals.APIURL + '/BkgLevel/upload/', formData)
    }

    BkgDocHAZSave(OD: MyBkgDocs) {
        return this.http.post(this.globals.APIURL + '/BkgLevel/BkgDocSave/', OD);
    }
    getDocsOOGlist(OL: MyBkgDocs): Observable<MyBkgDocs[]> {

        return this.http.post<MyBkgDocs[]>(this.globals.APIURL + '/BkgLevel/ViewDocsOOGlist', OL);
    }
    BkgDocOOGSave(OD: MyBkgDocs) {
        return this.http.post(this.globals.APIURL + '/BkgLevel/BkgDocOOGSave/', OD);
    }
    getDocsreeferlist(OL: MyBkgDocs): Observable<MyBkgDocs[]> {

        return this.http.post<MyBkgDocs[]>(this.globals.APIURL + '/BkgLevel/ViewDocsReeferlist', OL);
    }
    getOdoHazlist(OL: MyBkgDocs): Observable<MyBkgDocs[]> {

        return this.http.post<MyBkgDocs[]>(this.globals.APIURL + '/BkgLevel/ViewDocsOdolist', OL);
    }
    getDocsHazAttachlist(OL: MyBkgDocs): Observable<MyBkgDocs[]> {

        return this.http.post<MyBkgDocs[]>(this.globals.APIURL + '/BkgLevel/ViewDocsHazAttachlist', OL);
    }
    getDocsOOGAttachlist(OL: MyBkgDocs): Observable<MyBkgDocs[]> {

        return this.http.post<MyBkgDocs[]>(this.globals.APIURL + '/BkgLevel/ViewDocsOOGAttachlist', OL);
    }
    getDocsODOAttachlist(OL: MyBkgDocs): Observable<MyBkgDocs[]> {

        return this.http.post<MyBkgDocs[]>(this.globals.APIURL + '/BkgLevel/ViewDocsODOAttachlist', OL);
    }
    AttachDelete(OD: MyBkgDocs) {

        return this.http.post(this.globals.APIURL + '/BkgLevel/DocsAttachDelete/', OD);
    }
    public download(fileUrl: string) {
        return this.http.get(`${this.globals.APIURL}/BkgLevel/download?fileUrl=${fileUrl}`, {
            reportProgress: true,
            observe: 'events',
            responseType: 'blob'
        });
    }

}
