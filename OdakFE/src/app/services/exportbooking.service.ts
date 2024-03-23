import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from '../globals';
import { Route } from '@angular/router';
import { ExportBooking, ExportBkgContainer, ExportBkgHaz, ExportBkgReefer, ExportBkgOutGauge, ExportBkgOceanFrt, ExportBkgShipment } from 'src/app/model/exportbooking';


@Injectable({
  providedIn: 'root'
})
export class ExportbookingService {

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

    getExBookingValues(OL: ExportBooking): Observable<ExportBooking[]> {
        return this.http.post<ExportBooking[]>(this.globals.APIURL + '/ExportBooking/BookingBind', OL);
    }
    getExBookingContrValues(OL: ExportBkgContainer): Observable<ExportBkgContainer[]> {
        return this.http.post<ExportBkgContainer[]>(this.globals.APIURL + '/ExportBooking/ExBookingCntrBind', OL);
    }
    getExBookingHazValues(OL: ExportBkgHaz): Observable<ExportBkgHaz[]> {
        return this.http.post<ExportBkgHaz[]>(this.globals.APIURL + '/ExportBooking/ExBookingHazBind', OL);
    }
    getExBookingReeferValues(OL: ExportBkgReefer): Observable<ExportBkgReefer[]> {
        return this.http.post<ExportBkgReefer[]>(this.globals.APIURL + '/ExportBooking/ExBookingReeferBind', OL);
    }
    getExBookingOutGaugeValues(OL: ExportBkgOutGauge): Observable<ExportBkgOutGauge[]> {
        return this.http.post<ExportBkgOutGauge[]>(this.globals.APIURL + '/ExportBooking/ExBookingOutBind', OL);
    }
    getExBookingOceanFrtValues(OL: ExportBkgOceanFrt): Observable<ExportBkgOceanFrt[]> {
        return this.http.post<ExportBkgOceanFrt[]>(this.globals.APIURL + '/ExportBooking/ExistingOceanFrtCharges', OL);
    }
    getExBookingSlotFrtValues(OL: ExportBkgOceanFrt): Observable<ExportBkgOceanFrt[]> {
        return this.http.post<ExportBkgOceanFrt[]>(this.globals.APIURL + '/ExportBooking/ExistingSlotFrtCharges', OL);
    }
    getExBookingPOLValues(OL: ExportBkgShipment): Observable<ExportBkgShipment[]> {
        return this.http.post<ExportBkgShipment[]>(this.globals.APIURL + '/ExportBooking/ExistingPOL', OL);
    }
    getExBookingPODValues(OL: ExportBkgShipment): Observable<ExportBkgShipment[]> {
        return this.http.post<ExportBkgShipment[]>(this.globals.APIURL + '/ExportBooking/ExistingPOD', OL);
    }
}
