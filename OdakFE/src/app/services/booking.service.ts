import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from '../globals';
import { BookingMaster } from '../model/booking';
import {
    myenquiry, myCntrTypesDynamicGrid, myHazardousDynamicGrid, myDynamicOutGaugeCargoGrid, myDynamicReeferGrid,
    myenquiryFreightDynamicgrid, myDynamicShimpmentPOLGrid, myDynamicShimpmentPODGrid
} from '../model/enquiry';
import { Commodity, ContainerType, CTTypes, drodownVeslVoyage, GeneralMaster, Vessel, VoyageDetails } from '../model/common';
import { MyAgencyDropdown } from '../model/Admin';

@Injectable({
    providedIn: 'root'
})
export class BookingService {

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

    getEnquiryNo(OL: BookingMaster): Observable<BookingMaster[]> {
        return this.http.post<BookingMaster[]>(this.globals.APIURL + '/Booking/EnquiryMasterBind', OL);
    }

    viewBookingList(OL: BookingMaster): Observable<BookingMaster[]> {

        return this.http.post<BookingMaster[]>(this.globals.APIURL + '/Booking/BookingListView', OL);
    }


    bindExstingBookingList(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/Booking/ExistingBookingBind', OL, this.createAuthHeader());
    }

    getCommodityMasterList(): Observable<Commodity[]> {

        return this.http.post<Commodity[]>(this.globals.APIURL + '/CommonAccessApi/CommodityValues', this.createAuthHeader());
    }

    bindExstingEnquiryCntrTypeList(OL: myCntrTypesDynamicGrid): Observable<myCntrTypesDynamicGrid[]> {

        return this.http.post<myCntrTypesDynamicGrid[]>(this.globals.APIURL + '/Booking/ExistingBookingCntrTypeBind', OL, this.createAuthHeader());
    }


    bindExstingBookingHazardousList(OL: myHazardousDynamicGrid): Observable<myHazardousDynamicGrid[]> {

        return this.http.post<myHazardousDynamicGrid[]>(this.globals.APIURL + '/Booking/ExistingBookingHazardousBind', OL, this.createAuthHeader());
    }

    bindExstingBookingOutGaugeCargoList(OL: myDynamicOutGaugeCargoGrid): Observable<myDynamicOutGaugeCargoGrid[]> {

        return this.http.post<myDynamicOutGaugeCargoGrid[]>(this.globals.APIURL + '/Booking/ExistingBookingOutGaugeBind', OL, this.createAuthHeader());
    }


    bindExstingBookingRefferList(OL: myDynamicReeferGrid): Observable<myDynamicReeferGrid[]> {

        return this.http.post<myDynamicReeferGrid[]>(this.globals.APIURL + '/Booking/ExistingBookingRefferBind', OL, this.createAuthHeader());
    }

    bindExstingBookingFreightRateList(OL: myenquiryFreightDynamicgrid): Observable<myenquiryFreightDynamicgrid[]> {

        return this.http.post<myenquiryFreightDynamicgrid[]>(this.globals.APIURL + '/Booking/ExistingBookingFreightRateBind', OL, this.createAuthHeader());
    }

    bindExstingBookingSlotList(OL: myenquiryFreightDynamicgrid): Observable<myenquiryFreightDynamicgrid[]> {

        return this.http.post<myenquiryFreightDynamicgrid[]>(this.globals.APIURL + '/Booking/ExistingBookingSlotRateBind', OL, this.createAuthHeader());
    }


    bindExstingBookingShipmentPOLList(OL: myDynamicShimpmentPOLGrid): Observable<myDynamicShimpmentPOLGrid[]> {

        return this.http.post<myDynamicShimpmentPOLGrid[]>(this.globals.APIURL + '/Booking/ExistingBookingShimpmentPOLBind', OL, this.createAuthHeader());
    }

    bindExstingBookingShipmentPODList(OL: myDynamicShimpmentPODGrid): Observable<myDynamicShimpmentPODGrid[]> {

        return this.http.post<myDynamicShimpmentPODGrid[]>(this.globals.APIURL + '/Booking/ExistingBookingShimpmentPODBind', OL, this.createAuthHeader());
    }

    getAgencyMasterList(): Observable<MyAgencyDropdown[]> {

        return this.http.post<MyAgencyDropdown[]>(this.globals.APIURL + '/CommonAccessApi/AgencyMaster', this.createAuthHeader());
    }

    BookingSaveList(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/Booking/BookingInsert', OL, this.createAuthHeader());
    }
    viewBookinglevelList(OL: BookingMaster): Observable<BookingMaster[]> {

        return this.http.post<BookingMaster[]>(this.globals.APIURL + '/Booking/BookinglevelListView', OL);
    }

    BookingStatusList(OL: myenquiry): Observable<myenquiry[]> {

        return this.http.post<myenquiry[]>(this.globals.APIURL + '/Booking/bookingStatusUpdate', OL, this.createAuthHeader());
    }
}
