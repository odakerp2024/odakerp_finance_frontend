import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { Globals } from '../globals';
import { Operator } from 'rxjs';

import { Bankaccountlist, BankFilter, Currency, CurrencySearch, Ledger, LedgerSearch } from '../model/bankaccount';
import { BankaccountGetDetails, BankaccountModel } from '../model/Bankmodel';
@Injectable({
  providedIn: 'root'
})
export class BankService {


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
/*Bankaccount */
getbankaccountList(OL: Bankaccountlist): Observable<Bankaccountlist[]> {
    return this.http.post<Bankaccountlist[]>(this.globals.APIURL + '/Bank/GetBankList', OL);
}
getbankaccountFilter(OL: BankFilter): Observable< BankFilter[]> {
    return this.http.post< BankFilter[]>(this.globals.APIURL + '/Bank/GetBankFilter', OL);
}
saveaccount(OL: BankaccountModel): Observable<BankaccountModel[]> {

    return this.http.post<BankaccountModel[]>(this.globals.APIURL + '/Bank/SaveBank/',OL);
}
getBankaccountDetails(OL:BankaccountGetDetails): Observable< BankaccountGetDetails[]> {


    return this.http.post< BankaccountGetDetails[]>(this.globals.APIURL + '/Bank/GetBankId/',OL);
}

getTemplateDetails(OL): Observable<Currency[]> {
//   return this.http.post<any>(this.globals.APIURL + '/Bank/GetBankTemplateList', {});
    return this.http.post<any>(this.globals.APIURL + '/Template/GetTemplatesList', OL);
}
getCurrencyLists(OL:CurrencySearch): Observable<Currency[]> {

    return this.http.post<Currency[]>(this.globals.APIURL + '/Dropdown/GetCurrency',OL);
}
getLedgerLists(OL: LedgerSearch): Observable<Ledger[]> {

    return this.http.post<Ledger[]>(this.globals.APIURL + '/ChartOfAccounts/GetChartOfAccountsList',OL);
}

































}
