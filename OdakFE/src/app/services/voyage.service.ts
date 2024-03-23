import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { GridVoyageNoteMaster, TerminalGrid, TerminalMaster, VesselMaster, Voyage, VoyageNoteTypeMaster, PortMaster } from 'src/app/model/Voyage';
import { SalesOffice } from 'src/app/model/org';
import { Globals } from '../globals';
import { Operator } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VoyageService {
    getVoyageMasterBind(value: any) {
        throw new Error('Method not implemented.');
    }

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
    getVesselBind(OL: VesselMaster): Observable<VesselMaster[]> {

        return this.http.post<VesselMaster[]>(this.globals.APIURL + '/Voyage/Vesseldropdown', OL);
    }
    //getTerminalMasterBind(OL: TerminalMaster): Observable<TerminalMaster[]> {

    //    return this.http.post<TerminalMaster[]>(this.globals.APIURL + '/Voyage/Terminaldropdown', OL);
    //}
    getVoyageNoteTypeMasterBind(OL: VoyageNoteTypeMaster): Observable<VoyageNoteTypeMaster[]> {

        return this.http.post<VoyageNoteTypeMaster[]>(this.globals.APIURL + '/Voyage/VoyageTypedropdown', OL);
    }
    getsaveVoyageform(OL: Voyage): Observable<Voyage[]> {

        return this.http.post<Voyage[]>(this.globals.APIURL + '/Voyage/InsertVoyageform', OL);
    }
    getVoyageViewlist(OL: Voyage): Observable<Voyage[]> {

        return this.http.post<Voyage[]>(this.globals.APIURL + '/Voyage/VoyageViewlist', OL);
    }
    getVoyageEdit(OL: Voyage): Observable<Voyage[]> {

        return this.http.post<Voyage[]>(this.globals.APIURL + '/Voyage/VoyageEdit', OL);
    }
    getVoyageEditTerminal(OL: TerminalGrid): Observable<TerminalGrid[]> {
        return this.http.post<TerminalGrid[]>(this.globals.APIURL + '/Voyage/VoyageEditTerminal', OL);
    }
    getVoyNoteEdit(OL: GridVoyageNoteMaster): Observable<GridVoyageNoteMaster[]> {
        return this.http.post<GridVoyageNoteMaster[]>(this.globals.APIURL + '/Voyage/VoyNoteEdit', OL);
    }
    getTeminalDelete(OL: TerminalGrid): Observable<TerminalGrid[]> {
        return this.http.post<TerminalGrid[]>(this.globals.APIURL + '/Voyage/TeminalDelete', OL);
    }
    getVoyageNoteDelete(OL: GridVoyageNoteMaster): Observable<GridVoyageNoteMaster[]> {
        return this.http.post<GridVoyageNoteMaster[]>(this.globals.APIURL + '/Voyage/VoyageNoteDelete', OL);
    }
    getPortList(OL: PortMaster): Observable<PortMaster[]> {

        return this.http.post<PortMaster[]>(this.globals.APIURL + '/CommonAccessApi/PortValues', OL);
    }
    getTerminalList(OL: TerminalMaster): Observable<TerminalMaster[]> {

        return this.http.post<TerminalMaster[]>(this.globals.APIURL + '/CommonAccessApi/BindTerminalPortMaster', OL);
    }
}
