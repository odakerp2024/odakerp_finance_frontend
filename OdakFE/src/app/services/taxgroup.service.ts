import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { Globals } from '../globals';
import { Operator } from 'rxjs';
import {  GetAssociatedType, GetAssociatedTypeSearch, GetSales, GetSalesSearch } from '../model/taxgroup';
import { TaxtypeModel } from '../model/Taxmodel';
import { TaxgroupFillter, Taxgrouplist } from '../model/taxgroup';
import { TaxGroup, TaxGroupIdModel } from '../model/TaxGoupModel';
import { GetTaxTypeFilter } from '../model/Taxtype';


@Injectable({
  providedIn: 'root'
})
export class TaxgroupService {
    
    
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

    taxgroupList(OL: Taxgrouplist): Observable<Taxgrouplist[]>{
    return this.http.post<Taxgrouplist[]>(this.globals.APIURL + '/TaxGroup/GetTaxGroupList',OL);
}

gettaxgroupFilter(OL: TaxgroupFillter): Observable<TaxgroupFillter[]>{
    return this.http.post<TaxgroupFillter[]>(this.globals.APIURL + '/TaxGroup/GetTaxGroupFilter',OL);
}
gettaxgroupLists(OL:GetAssociatedTypeSearch): Observable<GetAssociatedType[]> {

    return this.http.post<GetAssociatedType[]>(this.globals.APIURL + '/TaxType/GetTaxTypeList',OL);
}

getSales(OL:GetSalesSearch): Observable<GetSales[]> {

    return this.http.post<GetSales[]>(this.globals.APIURL + '/ChartOfAccounts/GetChartOfAccountsFilter',OL);
}

gettaxgroupList(OL:GetAssociatedTypeSearch): Observable<GetAssociatedType[]> {

    return this.http.post<GetAssociatedType[]>(this.globals.APIURL + '/TaxType/GetTaxTypeId',OL);
}

saveTaxGroup(OL:TaxGroup): Observable<TaxGroup[]> {

    return this.http.post<TaxGroup[]>(this.globals.APIURL + '/TaxGroup/SaveTaxGroup',OL);
}
getTaxGroupDetails(OL:TaxGroupIdModel): Observable<TaxGroupIdModel[]> {

    return this.http.post<TaxGroupIdModel[]>(this.globals.APIURL + '/TaxGroup/GetTaxGroupId',OL);
}

getassociatedFilter(OL: GetTaxTypeFilter): Observable< GetTaxTypeFilter[]> {
    return this.http.post< GetTaxTypeFilter[]>(this.globals.APIURL + '/TaxType/GetTaxTypeFilter', OL);
}


}
