import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Region, Office, State, SalesOffice, Org, DynamicGrid, DivisionTypes } from 'src/app/model/org';
import { Vessel, ServiceSetup, VoyageDetails } from 'src/app/model/common';
import { Slot, SvSlot, VOA, fileattach, SvSlotDtls } from 'src/app/model/slot';
import { Globals } from '../globals';
import { myTerminal } from '../model/Admin';


@Injectable({
    providedIn: 'root'
})
export class SlotmgmtService {

    /* readonly APIUrl = "https://localhost:44301/api";*/
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

    getVesselBind(OL: Vessel): Observable<Vessel[]> {
        return this.http.post<Vessel[]>(this.globals.APIURL + '/home/VesselDropDown', OL);
    }

    getSlotList(OL: Slot): Observable<Slot[]> {
        return this.http.post<Slot[]>(this.globals.APIURL + '/SlotApi/SlotView', OL,);
    }

    getVoyageBind(OL: VoyageDetails): Observable<VoyageDetails[]> {
        return this.http.post<VoyageDetails[]>(this.globals.APIURL + '/SlotApi/VoyageBind', OL);
    }
    getVoyageBindMaster(OL: VoyageDetails): Observable<VoyageDetails[]> {
        return this.http.post<VoyageDetails[]>(this.globals.APIURL + '/SlotApi/VoyageBindMaster', OL);
    }


    getVoyageETAETD(OL: SvSlot): Observable<SvSlot[]> {
        return this.http.post<SvSlot[]>(this.globals.APIURL + '/SlotApi/BindVoyageETAETD', OL);
    }

    getVOABind(OL: VOA): Observable<VOA[]> {
        return this.http.post<VOA[]>(this.globals.APIURL + '/SlotApi/VOAList', OL);
    }

    insertSlotRecord(OD: SvSlot) {

        return this.http.post(this.globals.APIURL + '/SlotApi/SlotSave/', OD);
    }

    GetSlot(OD: Slot) {
        return this.http.post(this.globals.APIURL + '/SlotApi/Slotsearch', OD);

    }
    //InsertPrincipalTariffdtls(OL: MYPrincipalTariff): Observable<MYPrincipalTariff[]> {

    InsertSlotDetails(OL: SvSlot): Observable<SvSlot[]> {

        return this.http.post<SvSlot[]>(this.globals.APIURL + '/SlotApi/InsertSlotdtls/', OL);
    }

    slotAttachSave(OD: fileattach) {

        return this.http.post<SvSlot[]>(this.globals.APIURL + '/SlotApi/SlotAttachments/', OD);
    }
    EditSlotMaster(OL: SvSlot): Observable<SvSlot[]> {

        return this.http.post<SvSlot[]>(this.globals.APIURL + '/SlotApi/EditSlotLoadMaster', OL);
    }

    GetSlotMgtEdit(OL: SvSlot): Observable<SvSlot[]> {

        return this.http.post<SvSlot[]>(this.globals.APIURL + '/SlotApi/ExistingSlotLoad', OL, this.createAuthHeader());
    }
    existingSlotBind1(OL: SvSlot): Observable<SvSlot[]> {

        return this.http.post<SvSlot[]>(this.globals.APIURL + '/SlotApi/ExistingSlotLoad1', OL, this.createAuthHeader());
    }
    getSpacePlanningList(OL: SvSlot): Observable<SvSlot[]> {
        return this.http.post<SvSlot[]>(this.globals.APIURL + '/SlotApi/SpacePlanningView', OL,);
    }
    AttachUpload(file): Observable<any> {

        const formData = new FormData();
        formData.append("file", file, file.name);
        return this.http.post(this.globals.APIURL + '/SlotApi/upload/', formData)
    }

    GetSlotMgtDtlsEdit(OL: SvSlotDtls): Observable<SvSlotDtls[]> {
        return this.http.post<SvSlotDtls[]>(this.globals.APIURL + '/SlotApi/SlotMgtDtlsEdit', OL,);
    }
    RemoveValues(OD: SvSlotDtls) {

        return this.http.post(this.globals.APIURL + '/SlotApi/SlotMgtDtlsRemoveValues/', OD);
    }
    // SpacePlanningView

    InsertAttachment(OL: SvSlot): Observable<SvSlot[]> {

        return this.http.post<SvSlot[]>(this.globals.APIURL + '/SlotApi/InsertAttachment/', OL);
    }
}

