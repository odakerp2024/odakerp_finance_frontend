import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { MYPortTariff, MyDynamicGridSlab, MyDynamicGridIHC, MyDynamicGridDOCharges, myDynamicGridTHCCharges, myDynamicIHCBrackupCharges } from 'src/app/model/PortTariff';
import { MyCntrTypeDropdown, MyCustomerDropdown, MyPortdrodown, MyTerminaldrodown } from 'src/app/model/Admin';
/*import { map } from 'jquery';*/
import { map, skipWhile, tap } from 'rxjs/operators'
import { LinerName, GeneralMaster, ChargeTBMaster, CurrencyMaster } from 'src/app/model/common';
import { Globals } from '../globals';


@Injectable({
    providedIn: 'root'
})
export class PorttariffService {

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

    getPrincibleList(): Observable<MyCustomerDropdown[]> {

        return this.http.post<MyCustomerDropdown[]>(this.globals.APIURL + '/CommonAccessApi/PrincipleMaster', this.createAuthHeader());
    }

    getCntrTypesList(): Observable<MyCntrTypeDropdown[]> {

        return this.http.post<MyCntrTypeDropdown[]>(this.globals.APIURL + '/CommonAccessApi/CntrTypeValues', this.createAuthHeader());
    }

    getPortList(): Observable<MyPortdrodown[]> {

        return this.http.post<MyPortdrodown[]>(this.globals.APIURL + '/CommonAccessApi/PortValues', this.createAuthHeader());
    }
    getTerminalList(OL: MyTerminaldrodown): Observable<MyTerminaldrodown[]> {

        return this.http.post<MyTerminaldrodown[]>(this.globals.APIURL + '/CommonAccessApi/BindTerminalPortMaster', OL, this.createAuthHeader());
    }

    getGeneralList(id): Observable<GeneralMaster[]> {

        return this.http.get<GeneralMaster[]>(this.globals.APIURL + '/CommonAccessApi/ModuleValues/' + id, this.createAuthHeader());
    }

    getChargeCodeList(): Observable<ChargeTBMaster[]> {

        return this.http.post<ChargeTBMaster[]>(this.globals.APIURL + '/CommonAccessApi/ChargeCode', this.createAuthHeader());
    }
    getCommoditylList(id): Observable<GeneralMaster[]> {

        return this.http.get<GeneralMaster[]>(this.globals.APIURL + '/CommonAccessApi/ModuleValues/' + id, this.createAuthHeader());
    }

    getCurrencyList(): Observable<CurrencyMaster[]> {

        return this.http.post<CurrencyMaster[]>(this.globals.APIURL + '/CommonAccessApi/CurrencyValues', this.createAuthHeader());
    }

    getServiceTypelList(id): Observable<GeneralMaster[]> {

        return this.http.get<GeneralMaster[]>(this.globals.APIURL + '/CommonAccessApi/ModuleValues/' + id, this.createAuthHeader());
    }

    SaveTariffPortList(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/SalesPortTariffInsert', OL, this.createAuthHeader());
    }

    SearchTariffPortList(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/PortTariffViewRecord', OL, this.createAuthHeader());
    }

    ExistingTariffPortList(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/PortTariffExistingMasterRecord', OL, this.createAuthHeader());
    }

    ExistingTariffPortdtlsList(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/PortTariffExistingRecord', OL, this.createAuthHeader());
    }

    getChargeCodeDetentionList(): Observable<ChargeTBMaster[]> {

        return this.http.post<ChargeTBMaster[]>(this.globals.APIURL + '/CommonAccessApi/ChargeCodeDetentionValue', this.createAuthHeader());
    }

    ExistingTariffPortSlabList(OL: MyDynamicGridSlab): Observable<MyDynamicGridSlab[]> {

        return this.http.post<MyDynamicGridSlab[]>(this.globals.APIURL + '/SalesApi/PortTariffSlabExistingRecord', OL, this.createAuthHeader());
    }

    ExistingTariffPortIHCList(OL: MyDynamicGridIHC): Observable<MyDynamicGridIHC[]> {

        return this.http.post<MyDynamicGridIHC[]>(this.globals.APIURL + '/SalesApi/PortTariffIHCExistingRecord', OL, this.createAuthHeader());
    }


    SaveTariffPortRateDOChargeList(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/SalesPortTariffRevenuDOChargesInsert', OL, this.createAuthHeader());
    }

    ExistingTariffPortRevenuDOChargesList(OL: MyDynamicGridDOCharges): Observable<MyDynamicGridDOCharges[]> {

        return this.http.post<MyDynamicGridDOCharges[]>(this.globals.APIURL + '/SalesApi/PortTariffRevenuDOChargesExistingRecord', OL, this.createAuthHeader());
    }


    SaveTariffPortTHCChargeList(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/InsertPortTariffTHCChargesMaster', OL, this.createAuthHeader());
    }


    ExistingTariffPortTHCChargesList(OL: myDynamicGridTHCCharges): Observable<myDynamicGridTHCCharges[]> {

        return this.http.post<myDynamicGridTHCCharges[]>(this.globals.APIURL + '/SalesApi/PortTariffTHCChargesBrackupExistingRecord', OL, this.createAuthHeader());
    }

    getPaymentTolList(id): Observable<GeneralMaster[]> {

        return this.http.get<GeneralMaster[]>(this.globals.APIURL + '/CommonAccessApi/ModuleValues/' + id, this.createAuthHeader());
    }


    SaveTariffPortIHCBackupChargeList(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/InsertPortTariffIHCBrackupChargesMaster', OL, this.createAuthHeader());
    }

    ExistingTariffPortIHCBrackupChargesList(OL: myDynamicIHCBrackupCharges): Observable<myDynamicIHCBrackupCharges[]> {

        return this.http.post<myDynamicIHCBrackupCharges[]>(this.globals.APIURL + '/SalesApi/PortTariffIHCChargesBrackupExistingRecord', OL, this.createAuthHeader());
    }

    ExistingTariffPortStor(OL: MyDynamicGridSlab): Observable<MyDynamicGridSlab[]> {

        return this.http.post<MyDynamicGridSlab[]>(this.globals.APIURL + '/SalesApi/PortTariffStorageExistingRecord', OL, this.createAuthHeader());
    }


    TariffPortchargesDelete(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/PortTariffChargedelete', OL, this.createAuthHeader());
    }

    TariffPortchargesDetentionDelete(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/PortTariffDetentionExpdelete', OL, this.createAuthHeader());
    }

    TariffPortchargesStorageDelete(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/PortTariffStorageExpdelete', OL, this.createAuthHeader());
    }

    TariffPortchargesIHCDelete(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/PortTariffIHCdelete', OL, this.createAuthHeader());
    }

    TariffPortDOChargesDelete(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/PortTariffDOChargesdelete', OL, this.createAuthHeader());
    }

    TariffPortTHCBrackupChargesDelete(OL: MYPortTariff): Observable<MYPortTariff[]> {

        return this.http.post<MYPortTariff[]>(this.globals.APIURL + '/SalesApi/PortTariffTHCBrackupChargesdelete', OL, this.createAuthHeader());
    }



}
