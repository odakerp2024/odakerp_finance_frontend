import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, skipWhile, tap } from 'rxjs/operators';
import { MyAgencyDropdown, MyCntrTypeDropdown, MyCustomerDropdown, MyPortdrodown, MyTerminaldrodown } from 'src/app/model/Admin';
import { MyAgency } from 'src/app/model/common';
import { BLCargoDtls, BLContainer, BLNo, BLTypes, BOL, PortVessel } from 'src/app/model/boldata';
import { Globals } from '../globals';


@Injectable({
  providedIn: 'root'
})
export class ExpbolService {

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

    getCustomerList(): Observable<MyCustomerDropdown[]> {

        return this.http.post<MyCustomerDropdown[]>(this.globals.APIURL + '/CommonAccessApi/CustomerMaster', this.createAuthHeader());
    }
    getBLNumberList(OL: BLNo): Observable<BLNo[]> {
        return this.http.post<BLNo[]>(this.globals.APIURL + '/ExpBol/BLNumber',OL, this.createAuthHeader());
    }
    getBLNumberDropDown(OL: BLNo): Observable<BLNo[]> {

        return this.http.post<BLNo[]>(this.globals.APIURL + '/ExpBol/BLNumber',OL, this.createAuthHeader());
    }
    getAgencyMaster(OL: MyAgencyDropdown): Observable<MyAgencyDropdown[]> {

        return this.http.post<MyAgencyDropdown[]>(this.globals.APIURL + '/CommonAccessApi/AgencyMaster', OL, this.createAuthHeader());
    }
    getBkgPortDtls(OL: BOL): Observable<BOL[]> {

        return this.http.post<BOL[]>(this.globals.APIURL + '/ExpBol/BkgPortVessel', OL, this.createAuthHeader());
    }
    getBLtypes(OL: BLTypes): Observable<BLTypes[]> {

        return this.http.post<BLTypes[]>(this.globals.APIURL + '/ExpBol/BLTypes', OL, this.createAuthHeader());
    }
    getBLContainer(OL: BLContainer): Observable<BLContainer[]> {

        return this.http.post<BLContainer[]>(this.globals.APIURL + '/ExpBol/BLContainerDtls', OL, this.createAuthHeader());
    }
    getPortVesselByBkg(OL: PortVessel): Observable<PortVessel[]> {

        return this.http.post<PortVessel[]>(this.globals.APIURL + '/ExpBol/PortVessByBkg', OL, this.createAuthHeader());
    }
    AttachUpload(file): Observable<any> {
        const formData = new FormData();
        formData.append("file", file, file.name);
        return this.http.post(this.globals.APIURL + '/ExpBol/upload/', formData)
    }
    AttachUploadCustomerApproval(file1): Observable<any> {
      
        const formData = new FormData();
        formData.append("file", file1, file1.name);
        return this.http.post(this.globals.APIURL + '/ExpBol/uploadApproval/', formData)
    }
    getShipperList(): Observable<BOL[]> {

        return this.http.post<BOL[]>(this.globals.APIURL + '/ExpBol/ShipperList', this.createAuthHeader());
    }
    getConsigneeList(): Observable<BOL[]> {

        return this.http.post<BOL[]>(this.globals.APIURL + '/ExpBol/ConsigneeList', this.createAuthHeader());
    }
    getNotifyList(): Observable<BOL[]> {

        return this.http.post<BOL[]>(this.globals.APIURL + '/ExpBol/NotifyList', this.createAuthHeader());
    }
    getNotifyAlsoList(): Observable<BOL[]> {

        return this.http.post<BOL[]>(this.globals.APIURL + '/ExpBol/NotifyAlsoList', this.createAuthHeader());
    }
    getExBkgDtls(OL: BLContainer): Observable<BLContainer[]> {
      
        return this.http.post<BLContainer[]>(this.globals.APIURL + '/ExpBol/BkgContainerDtls', OL, this.createAuthHeader());
    }
    getExBolDtls(OL: BOL): Observable<BOL[]> {

        return this.http.post<BOL[]>(this.globals.APIURL + '/ExpBol/ExistingBOLDtls', OL, this.createAuthHeader());
    }
    getExBolPartyDtls(OL: BOL): Observable<BOL[]> {

        return this.http.post<BOL[]>(this.globals.APIURL + '/ExpBol/ExistingPartiesDtls', OL, this.createAuthHeader());
    }
    updateApprovalStatus(OL: BOL): Observable<BOL[]> {

        return this.http.post<BOL[]>(this.globals.APIURL + '/ExpBol/UpdateBLStatus', OL, this.createAuthHeader());
    }
    getBLNumberView(OL: BOL): Observable<BOL[]> {

        return this.http.post<BOL[]>(this.globals.APIURL + '/ExpBol/BLNumberView', OL, this.createAuthHeader());
    }
    getBLNumberValue(OL: BLNo): Observable<BLNo[]> {

        return this.http.post<BLNo[]>(this.globals.APIURL + '/ExpBol/BLNumberValue', OL, this.createAuthHeader());
    }
    updateBLCntrDtls(OL: BLCargoDtls): Observable<BLCargoDtls[]> {
      
        return this.http.post<BLCargoDtls[]>(this.globals.APIURL + '/ExpBol/UpdateCntrDtls', OL, this.createAuthHeader());
    }
    public download(fileUrl: string) {
      
        return this.http.get(`${this.globals.APIURL}/ExpBol/downloadShippingBill?fileUrl=${fileUrl}`, {
            reportProgress: true,
            observe: 'events',
            responseType: 'blob'
        });
    }
    public downloadapproval(fileUrl2: string) {

        return this.http.get(`${this.globals.APIURL}/ExpBol/downloadCustomerApproval?fileUrl2=${fileUrl2}`, {
            reportProgress: true,
            observe: 'events',
            responseType: 'blob'
        });
    }
    saveBOL(OD: BOL) {
        return this.http.post(this.globals.APIURL + '/ExpBol/BolMaster/', OD);
    }

    //getEmailSend(OL: BOL): Observable<BOL[]> {

    //    return this.http.post<BOL[]>(this.globals.APIURL + '/ExpBol/VesselEmailSend', OL, this.createAuthHeader());
    //}
   
}
