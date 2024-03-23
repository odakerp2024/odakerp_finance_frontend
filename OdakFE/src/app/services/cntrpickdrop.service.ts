import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { MYPortTariff, MyDynamicGridSlab, MyDynamicGridIHC, MyDynamicGridDOCharges, myDynamicGridTHCCharges, myDynamicIHCBrackupCharges } from 'src/app/model/PortTariff';
import { MyAgencyDropdown, MyCntrTypeDropdown, MyCustomerDropdown, MyPortdrodown, MyTerminaldrodown } from 'src/app/model/Admin';
/*import { map } from 'jquery';*/
import { map, skipWhile, tap } from 'rxjs/operators'
import { GeneralMaster, drodownVeslVoyage, CurrencyMaster, ChargeTBMaster } from 'src/app/model/common';
import { Globals } from '../globals';
import { CntrPickDrop } from '../model/CntrPickDepo';
@Injectable({
  providedIn: 'root'
})
export class CntrpickdropService {

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

    getPickDropTypeList(): Observable<CntrPickDrop[]> {

        return this.http.post<CntrPickDrop[]>(this.globals.APIURL + '/CntrPickDrop/BindPickUpDropTypes', this.createAuthHeader());
    }
    getStorageLocList(): Observable<CntrPickDrop[]> {

        return this.http.post<CntrPickDrop[]>(this.globals.APIURL + '/CntrPickDrop/BindStorageLocation', this.createAuthHeader());
    }
    
    AttachUpload(file): Observable<any> {

        const formData = new FormData();
        formData.append("file", file, file.name);
        return this.http.post(this.globals.APIURL + '/CntrPickDrop/upload/', formData)
    }
}
