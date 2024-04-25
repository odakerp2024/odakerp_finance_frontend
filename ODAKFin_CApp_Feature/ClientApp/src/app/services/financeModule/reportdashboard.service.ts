import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Globals } from 'src/app/globals';
import { DynamicRepDashGrid, DynamicRepDashGrid1 } from 'src/app/model/financeModule/FNRepDash';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
    providedIn: 'root'
  })
export class reportdashboardService{

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

  SaveRepDashboard(OD: DynamicRepDashGrid) {
    return this.http.post(this.globals.APIURL + '/FNReportDash/SaveReportDashboardDtls/', OD);
}
getRepDashboardEdit(OL: DynamicRepDashGrid): Observable<DynamicRepDashGrid[]> {

    return this.http.post<DynamicRepDashGrid[]>(this.globals.APIURL + '/FNReportDash/ExistingRepDashboard', OL, this.createAuthHeader());
}
getRepDashboardEditByID(OL: DynamicRepDashGrid): Observable<DynamicRepDashGrid[]> {

    return this.http.post<DynamicRepDashGrid[]>(this.globals.APIURL + '/FNReportDash/ExistingRepDashByID', OL, this.createAuthHeader());
}
getRepDashDelete(OL: DynamicRepDashGrid): Observable<DynamicRepDashGrid[]> {

    return this.http.post<DynamicRepDashGrid[]>(this.globals.APIURL + '/FNReportDash/RepDashboardDelete', OL, this.createAuthHeader());
}

getDashboardDropDown(OL: DynamicRepDashGrid): Observable<DynamicRepDashGrid[]> {

    return this.http.post<DynamicRepDashGrid[]>(this.globals.APIURL + '/FNReportDash/Dashboarddropdown', OL, this.createAuthHeader());
}

getDashboardDropChange(OL: DynamicRepDashGrid): Observable<DynamicRepDashGrid[]> {

    return this.http.post<DynamicRepDashGrid[]>(this.globals.APIURL + '/FNReportDash/Dashboarddropchange', OL, this.createAuthHeader());
}

SaveRepDashMapping(OD: DynamicRepDashGrid) {
    return this.http.post(this.globals.APIURL + '/FNReportDash/SaveReportDashMappingDtls/', OD);
}
SaveRepDashMapping1(OD: DynamicRepDashGrid) {
    return this.http.post(this.globals.APIURL + '/FNReportDash/SaveReportDashMappingDtls1/', OD);
}

getRepDashMappingEditByID(OL: DynamicRepDashGrid): Observable<DynamicRepDashGrid[]> {

    return this.http.post<DynamicRepDashGrid[]>(this.globals.APIURL + '/FNReportDash/ExistingRepDashMappingByID', OL, this.createAuthHeader());
}
getRepDashMappingDelete(OL: DynamicRepDashGrid): Observable<DynamicRepDashGrid[]> {

    return this.http.post<DynamicRepDashGrid[]>(this.globals.APIURL + '/FNReportDash/RepDashMappingDelete', OL, this.createAuthHeader());
}

getReportsView(OL: DynamicRepDashGrid): Observable<DynamicRepDashGrid[]> {

    return this.http.post<DynamicRepDashGrid[]>(this.globals.APIURL + '/FNReportDash/ReportsView', OL, this.createAuthHeader());
}
getReportsTitles(OL: DynamicRepDashGrid1): Observable<DynamicRepDashGrid1[]> {

    return this.http.post<DynamicRepDashGrid1[]>(this.globals.APIURL + '/FNReportDash/ReportsTitle', OL, this.createAuthHeader());
}


}