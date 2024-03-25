import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { Globals } from '../globals';
import { Operator } from 'rxjs';
import { Associatedlist, Country, CountrySearch, GetAssociatedType, GetAssociatedTypeSearch, GetTaxTypeFilter } from '../model/Taxtype';
import { TaxtypeGetDetails, TaxtypeModel } from '../model/Taxmodel';


@Injectable({
  providedIn: 'root'
})
export class TaxtypeService {
    
    
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


getCountryList(OL:CountrySearch): Observable<Country[]> {

    return this.http.post<Country[]>(this.globals.APIURL + '/Dropdown/GetCountry',OL);
}

getAssociatedList(OL:GetAssociatedTypeSearch): Observable<GetAssociatedType[]> {

    return this.http.post<GetAssociatedType[]>(this.globals.APIURL + '/Dropdown/GetAssociatedType',OL);
}

associatedgetList(OL: Associatedlist): Observable<Associatedlist[]>{
    return this.http.post<Associatedlist[]>(this.globals.APIURL + '/TaxType/GetTaxTypeList',OL);
}
getassociatedFilter(OL: GetTaxTypeFilter): Observable< GetTaxTypeFilter[]> {
    return this.http.post< GetTaxTypeFilter[]>(this.globals.APIURL + '/TaxType/GetTaxTypeFilter', OL);
}

savetaxtype(OL: TaxtypeModel): Observable<TaxtypeModel[]> {

    return this.http.post<TaxtypeModel[]>(this.globals.APIURL + '/TaxType/SaveTaxType/',OL);
}

getTaxtypeDetails(OL:TaxtypeGetDetails): Observable<TaxtypeGetDetails[]> {


    return this.http.post<TaxtypeGetDetails[]>(this.globals.APIURL + '/TaxType/GetTaxTypeId/',OL);
}

}
