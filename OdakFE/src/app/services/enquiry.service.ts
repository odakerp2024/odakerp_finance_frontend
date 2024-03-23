import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { MYPortTariff, MyDynamicGridSlab, MyDynamicGridIHC, MyDynamicGridDOCharges, myDynamicGridTHCCharges, myDynamicIHCBrackupCharges } from 'src/app/model/PortTariff';
import { MyAgencyDropdown, MyCntrTypeDropdown, MyCustomerDropdown, MyPortdrodown, MyTerminaldrodown } from 'src/app/model/Admin';
/*import { map } from 'jquery';*/
import { map, skipWhile, tap } from 'rxjs/operators'
import { GeneralMaster, drodownVeslVoyage, CurrencyMaster, ChargeTBMaster } from 'src/app/model/common';
import { Globals } from '../globals';
import {
    myCntrTypesDynamicGrid, MyCargoMaster, mydropdownPort, myenquiryFreightDynamicgrid, myenquiryRevenuDynamicgrid,
    myenquiry, myHazardousDynamicGrid, myDynamicOutGaugeCargoGrid, myDynamicReeferGrid, myDynamicShimpmentPOLGrid,
    myDynamicShimpmentPODGrid, myFreightBrackupDynamicgrid, MyLinerDropdown, MyCustomerContractDropdown
} from 'src/app/model/enquiry';


@Injectable({
    providedIn: 'root'
})
export class EnquiryService {

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

    getCustomerList(): Observable<MyCustomerDropdown[]> {

        return this.http.post<MyCustomerDropdown[]>(this.globals.APIURL + '/CommonAccessApi/CustomerMaster', this.createAuthHeader());
    }
    getUserMasterList(): Observable<MyCustomerDropdown[]> {

        return this.http.post<MyCustomerDropdown[]>(this.globals.APIURL + '/CommonAccessApi/UserMaster', this.createAuthHeader());
    }

    getAgencyMasterList(): Observable<MyAgencyDropdown[]> {

        return this.http.post<MyAgencyDropdown[]>(this.globals.APIURL + '/CommonAccessApi/AgencyMaster', this.createAuthHeader());
    }


    getPortList(): Observable<MyPortdrodown[]> {

        return this.http.post<MyPortdrodown[]>(this.globals.APIURL + '/CommonAccessApi/PortValues', this.createAuthHeader());
    }

    getGeneralList(id): Observable<GeneralMaster[]> {

        return this.http.get<GeneralMaster[]>(this.globals.APIURL + '/CommonAccessApi/ModuleValues/' + id, this.createAuthHeader());
    }

    getVslVoyList(): Observable<drodownVeslVoyage[]> {

        return this.http.post<drodownVeslVoyage[]>(this.globals.APIURL + '/CommonAccessApi/VesselMaster', this.createAuthHeader());
    }

    getCntrTypesList(): Observable<MyCntrTypeDropdown[]> {

        return this.http.post<MyCntrTypeDropdown[]>(this.globals.APIURL + '/CommonAccessApi/CntrTypeValues', this.createAuthHeader());
    }

    getTerminalList(OL: MyTerminaldrodown): Observable<MyTerminaldrodown[]> {

        return this.http.post<MyTerminaldrodown[]>(this.globals.APIURL + '/CommonAccessApi/BindTerminalPortMaster', OL, this.createAuthHeader());
    }

    getCargoMasterList(): Observable<MyCargoMaster[]> {

        return this.http.post<MyCargoMaster[]>(this.globals.APIURL + '/CommonAccessApi/CommodityValues', this.createAuthHeader());
    }

    getPrincibleList(): Observable<MyCustomerDropdown[]> {

        return this.http.post<MyCustomerDropdown[]>(this.globals.APIURL + '/CommonAccessApi/PrincipleMaster', this.createAuthHeader());
    }
    getPrincibleAgenctPort(OL: mydropdownPort): Observable<mydropdownPort[]> {

        return this.http.post<mydropdownPort[]>(this.globals.APIURL + '/enquiryApi/equiryPrincipalport', OL, this.createAuthHeader());
    }

    getPrincibleFreightCharges(OL: myenquiryFreightDynamicgrid): Observable<myenquiryFreightDynamicgrid[]> {

        return this.http.post<myenquiryFreightDynamicgrid[]>(this.globals.APIURL + '/enquiryApi/equiryPrincipalFreightCharges', OL, this.createAuthHeader());
    }

    getPrincibleRevenuCharges(OL: myenquiryRevenuDynamicgrid): Observable<myenquiryRevenuDynamicgrid[]> {

        return this.http.post<myenquiryRevenuDynamicgrid[]>(this.globals.APIURL + '/enquiryApi/equiryPrincipalRevenuCharges', OL, this.createAuthHeader());
    }

    EnquirySaveList(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/enquiryApi/enquiryInsert', OL, this.createAuthHeader());
    }

    viewExstingEnquiryList(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/enquiryApi/exsistingenquiry', OL, this.createAuthHeader());
    }

    bindExstingEnquiryList(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/enquiryApi/ExistingEnquiryBind', OL, this.createAuthHeader());
    }

    bindExstingEnquiryCntrTypeList(OL: myCntrTypesDynamicGrid): Observable<myCntrTypesDynamicGrid[]> {

        return this.http.post<myCntrTypesDynamicGrid[]>(this.globals.APIURL + '/enquiryApi/ExistingEnquiryCntrTypeBind', OL, this.createAuthHeader());
    }

    bindExstingEnquiryHazardousList(OL: myHazardousDynamicGrid): Observable<myHazardousDynamicGrid[]> {

        return this.http.post<myHazardousDynamicGrid[]>(this.globals.APIURL + '/enquiryApi/ExistingEnquiryHazardousBind', OL, this.createAuthHeader());
    }

    bindExstingEnquiryOutGaugeCargoList(OL: myDynamicOutGaugeCargoGrid): Observable<myDynamicOutGaugeCargoGrid[]> {

        return this.http.post<myDynamicOutGaugeCargoGrid[]>(this.globals.APIURL + '/enquiryApi/ExistingEnquiryOutGaugeBind', OL, this.createAuthHeader());
    }

    bindExstingEnquiryRefferList(OL: myDynamicReeferGrid): Observable<myDynamicReeferGrid[]> {

        return this.http.post<myDynamicReeferGrid[]>(this.globals.APIURL + '/enquiryApi/ExistingEnquiryRefferBind', OL, this.createAuthHeader());
    }


    bindExstingEnquiryShipmentPOLList(OL: myDynamicShimpmentPOLGrid): Observable<myDynamicShimpmentPOLGrid[]> {

        return this.http.post<myDynamicShimpmentPOLGrid[]>(this.globals.APIURL + '/enquiryApi/ExistingEnquiryShimpmentPOLBind', OL, this.createAuthHeader());
    }

    bindExstingEnquiryShipmentPODList(OL: myDynamicShimpmentPODGrid): Observable<myDynamicShimpmentPODGrid[]> {

        return this.http.post<myDynamicShimpmentPODGrid[]>(this.globals.APIURL + '/enquiryApi/ExistingEnquiryShimpmentPODBind', OL, this.createAuthHeader());
    }


    bindExstingEnquiryFreightRateList(OL: myenquiryFreightDynamicgrid): Observable<myenquiryFreightDynamicgrid[]> {

        return this.http.post<myenquiryFreightDynamicgrid[]>(this.globals.APIURL + '/enquiryApi/ExistingEnquiryFreightRateBind', OL, this.createAuthHeader());
    }

    bindExstingEnquirySlotList(OL: myenquiryFreightDynamicgrid): Observable<myenquiryFreightDynamicgrid[]> {

        return this.http.post<myenquiryFreightDynamicgrid[]>(this.globals.APIURL + '/enquiryApi/ExistingEnquirySlotRateBind', OL, this.createAuthHeader());
    }

    bindExstingEnquiryRevenuRateList(OL: myenquiryRevenuDynamicgrid): Observable<myenquiryRevenuDynamicgrid[]> {

        return this.http.post<myenquiryRevenuDynamicgrid[]>(this.globals.APIURL + '/enquiryApi/ExistingEnquiryRevenuRateBind', OL, this.createAuthHeader());
    }

    getCurrencyList(): Observable<CurrencyMaster[]> {

        return this.http.post<CurrencyMaster[]>(this.globals.APIURL + '/CommonAccessApi/CurrencyValues', this.createAuthHeader());
    }
    getChargeCodeList(): Observable<ChargeTBMaster[]> {

        return this.http.post<ChargeTBMaster[]>(this.globals.APIURL + '/CommonAccessApi/ChargeCode', this.createAuthHeader());
    }
    InsertfromEnquiry(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/enquiryApi/InsertFromEnquiry', OL);
    }

    EnquiryFreightBrackupSaveList(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/enquiryApi/enquiryFreightBrackupInsert', OL, this.createAuthHeader());
    }

    bindExstingEnquiryFreightBrackupList(OL: myFreightBrackupDynamicgrid): Observable<myFreightBrackupDynamicgrid[]> {

        return this.http.post<myFreightBrackupDynamicgrid[]>(this.globals.APIURL + '/enquiryApi/ExistingFreightBrackupvalues', OL, this.createAuthHeader());
    }


    bindCommodityHSCode(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/enquiryApi/ExistingCommodityHSCode', OL, this.createAuthHeader());
    }


    getLinerContractList(): Observable<MyLinerDropdown[]> {

        return this.http.post<MyLinerDropdown[]>(this.globals.APIURL + '/enquiryApi/LinerMaster', this.createAuthHeader());
    }

    getCustomerContractList(): Observable<MyCustomerContractDropdown[]> {

        return this.http.post<MyCustomerContractDropdown[]>(this.globals.APIURL + '/enquiryApi/CustomerContractMaster', this.createAuthHeader());
    }

    InsertCopyEnquiry(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/enquiryApi/enquiryCopyInsert', OL);
    }


    EnquiryStatusList(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/enquiryApi/enquiryStatusUpdate', OL, this.createAuthHeader());
    }


    getVoyageList(id): Observable<drodownVeslVoyage[]> {

        return this.http.get<drodownVeslVoyage[]>(this.globals.APIURL + '/CommonAccessApi/newVoyageMaster/' + id, this.createAuthHeader());
    }
    //getVoyageList(OL: drodownVeslVoyage): Observable<drodownVeslVoyage[]> {

    //    return this.http.get<drodownVeslVoyage[]>(this.globals.APIURL + '/CommonAccessApi/VoyageMaster/' + OL, this.createAuthHeader());
    //}


    getOfficeList(): Observable<MyCustomerDropdown[]> {

        return this.http.post<MyCustomerDropdown[]>(this.globals.APIURL + '/CommonAccessApi/OfficeLocationMaster', this.createAuthHeader());
    }

    DeleteEnqCntrType(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/enquiryApi/EnquiryCntrTypeDelete', OL, this.createAuthHeader());
    }

}
