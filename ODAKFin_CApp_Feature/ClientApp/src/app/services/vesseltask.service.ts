import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from '../globals';
import { VesselTaskMaster } from 'src/app/model/vesseltask';
import { VesselTaskMaster1, VesselLoadCnfrm } from 'src/app/model/vesseltask';

@Injectable({
  providedIn: 'root'
})
export class VesseltaskService {

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
    getVesselTasklistBind(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {
        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/VesselTasklistBind', OL);
    }

    getPrealertStatusBind(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {
        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/PreAlertStatusBind', OL);
    }

    getPrealertFinalBind(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {
        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/PreAlertFinalBind', OL);
    }

    getPrealertMailBind(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {
        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/PreAlertMailBind', OL);
    }

    getOnboardConfirmBind(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {
        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/OnboardConfirmBind', OL);
    }

    insertOnboardMail(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {
        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/InsertOnboardMail', OL);
    }

    getTDRStatusBind(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {
        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/TDRStatusBind', OL);
    }

    getTDRFinalBind(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {
        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/TDRFinalBind', OL);
    }

    getTDRMailBind(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {
        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/PreAlertMailBind', OL);
    }



    getEmailSend(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {

        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/VesselEmailSend', OL, this.createAuthHeader());
    }

    getOnboardEmailSend(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {

        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/OnBoardEmailSend', OL, this.createAuthHeader());
    }

    getTDREmailSend(OL: VesselTaskMaster): Observable<VesselTaskMaster[]> {

        return this.http.post<VesselTaskMaster[]>(this.globals.APIURL + '/VesselTask/TDREmailSend', OL, this.createAuthHeader());
    }


    getVesselTaskViewlist(OL: VesselTaskMaster1): Observable<VesselTaskMaster1[]> {

        return this.http.post<VesselTaskMaster1[]>(this.globals.APIURL + '/VesselTask/VesselTaskViewlist', OL);
    }
    getVesselLoadCnfrmViewlist(OL: VesselLoadCnfrm): Observable<VesselLoadCnfrm[]> {

        return this.http.post<VesselLoadCnfrm[]>(this.globals.APIURL + '/VesselTask/VesselLoadCnfrmViewlist', OL);
    }

    getVesselLoadCnfrmViewlist1(OL: VesselLoadCnfrm): Observable<VesselLoadCnfrm[]> {
        return this.http.post<VesselLoadCnfrm[]>(this.globals.APIURL + '/VesselTask/VesselLoadCnfrmViewlist1', OL);
    }
}
