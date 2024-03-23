import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Country, City, MyAgency, Port, Terminal, Commodity, Cargo, UOMMaster, StateMaster, Depot, DamageMaster, RepairMaster, ContLocationMaster, Assembly, GeneralMaster, Notes, NotesGrid, ComponentMaster, ContainerType, CTTypes, State, Vessel, ServiceSetup, SlotOperator, VoyageDetails, DynamicGridSchedule, DynamicGridOperator, DynamicGridManifest, DynamicGridNotes, DynamicPDF1, OrganizationOfficeApi, DivisionMaster } from 'src/app/model/common';
import { SalesOffice } from 'src/app/model/org';
import { Globals } from '../globals';
import { GetCOAConfigurationList } from '../model/financeModule/chartaccountcode';
import { COAConfigurationModel, Maninaccountlabel, SaveCOAConfiguration } from '../model/Createchartaccountcode';

@Injectable({
  providedIn: 'root'
})
export class ChartaccountcodeService {
    ORGANZATION: any; 
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
    getGetCOAConfigurationList(OL:  COAConfigurationModel): Observable< COAConfigurationModel[]> {
        return this.http.post< COAConfigurationModel[]>(this.globals.APIURL + '/ChartOfAccounts/GetCOAConfigurationList', OL);
    }
    
    getSubAccountGroup(OL:Maninaccountlabel): Observable<Maninaccountlabel[]> {

        return this.http.post<Maninaccountlabel[]>(this.globals.APIURL + '/Dropdown/getSubAccountGroup',OL);
    }
    saveCOAConfiguration(OL:SaveCOAConfiguration): Observable<SaveCOAConfiguration[]> {

        return this.http.post<SaveCOAConfiguration[]>(this.globals.APIURL + '/ChartOfAccounts/SaveCOAConfiguration',OL);
    }

}
