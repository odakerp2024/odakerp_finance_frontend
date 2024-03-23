import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { MyAgencyDropdown, MyCntrTypeDropdown, MyCustomerDropdown, MyPortdrodown, MyTerminaldrodown } from 'src/app/model/Admin';
/*import { map } from 'jquery';*/
import { map, skipWhile, tap } from 'rxjs/operators'
import { GeneralMaster, drodownVeslVoyage, CurrencyMaster, ChargeTBMaster } from 'src/app/model/common';
import { Globals } from '../globals';
import {
    MycontainerDynamicGrid, myBL, BLNumberDynamicGrid
} from 'src/app/model/Container';
import { myCntrTypesDynamicGrid, MyCargoMaster } from 'src/app/model/enquiry';
import { ExportBooking } from '../model/exportbooking';


@Injectable({
    providedIn: 'root'
})
export class ContainerService {

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
    getBLContainerViewList(OL: MycontainerDynamicGrid): Observable<MycontainerDynamicGrid[]> {

        return this.http.post<MycontainerDynamicGrid[]>(this.globals.APIURL + '/ContainerApi/BLContainerView', OL, this.createAuthHeader());
    }

    getBLContainerALLList(OL: MycontainerDynamicGrid): Observable<MycontainerDynamicGrid[]> {

        return this.http.post<MycontainerDynamicGrid[]>(this.globals.APIURL + '/ContainerApi/BLContainerViewALL', OL, this.createAuthHeader());
    }

    getCurrentDatetime(OL: myBL): Observable<myBL[]> {

        return this.http.post<myBL[]>(this.globals.APIURL + '/ContainerApi/GetCurrenctDatetime', OL, this.createAuthHeader());
    }

    getBLContainerList(OL: MycontainerDynamicGrid): Observable<MycontainerDynamicGrid[]> {

        return this.http.post<MycontainerDynamicGrid[]>(this.globals.APIURL + '/ContainerApi/BLContainerList', OL, this.createAuthHeader());
    }

    getBLNumberDisplayList(OL: BLNumberDynamicGrid): Observable<BLNumberDynamicGrid[]> {

        return this.http.post<BLNumberDynamicGrid[]>(this.globals.APIURL + '/ContainerApi/BLNumberList', OL, this.createAuthHeader());
    }


    BLContainerSaveList(OL: myBL): Observable<myBL[]> {

        return this.http.post<myBL[]>(this.globals.APIURL + '/ContainerApi/InsertBLMaster', OL, this.createAuthHeader());
    }
    BLContainerRemoveList(OL: myBL): Observable<myBL[]> {

        return this.http.post<myBL[]>(this.globals.APIURL + '/ContainerApi/BLCntrRemovedMaster', OL, this.createAuthHeader());
    }

    BLContainerAddList(OL: myBL): Observable<myBL[]> {

        return this.http.post<myBL[]>(this.globals.APIURL + '/ContainerApi/InsertBLAddCntrMaster', OL, this.createAuthHeader());
    }
    BLContainerPartBLList(OL: myBL): Observable<myBL[]> {

        return this.http.post<myBL[]>(this.globals.APIURL + '/ContainerApi/InsertPartBLMaster', OL, this.createAuthHeader());
    }

    getBLContainerLalueList(OL: myBL): Observable<myBL[]> {

        return this.http.post<myBL[]>(this.globals.APIURL + '/ContainerApi/BLContainerValue', OL, this.createAuthHeader());
    }

    getBLNumberList(OL: myBL): Observable<myBL[]> {

        return this.http.post<myBL[]>(this.globals.APIURL + '/ContainerApi/BLNumberContainerwise', OL, this.createAuthHeader());
    }

    getCargoMasterList(): Observable<MyCargoMaster[]> {

        return this.http.post<MyCargoMaster[]>(this.globals.APIURL + '/CommonAccessApi/CargoTypesMaster', this.createAuthHeader());
    }


    BLCargoSaveList(OL: myBL): Observable<myBL[]> {

        return this.http.post<myBL[]>(this.globals.APIURL + '/ContainerApi/BLCargoInsert', OL, this.createAuthHeader());
    }

    BLNoDisplayList(OL: myBL): Observable<myBL[]> {

        return this.http.post<myBL[]>(this.globals.APIURL + '/ContainerApi/BLNoDisplayList', OL, this.createAuthHeader());
    }

    BLCntrNoDisplayList(OL: myBL): Observable<myBL[]> {

        return this.http.post<myBL[]>(this.globals.APIURL + '/ContainerApi/BLNoCntrNoDisplayList', OL, this.createAuthHeader());
    }

    ExcelBLCargoSaveList(OL: myBL): Observable<myBL[]> {

        return this.http.post<myBL[]>(this.globals.APIURL + '/ContainerApi/ExcelBLCargoInsert', OL, this.createAuthHeader());
    }

    getExBookingValues(OL: ExportBooking): Observable<ExportBooking[]> {
        return this.http.post<ExportBooking[]>(this.globals.APIURL + '/ContainerApi/BookingBind', OL);
    }

}
