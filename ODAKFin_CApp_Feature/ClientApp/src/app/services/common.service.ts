import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { LinerName, GeneralMaster } from 'src/app/model/common';
/*import { map } from 'jquery';*/
import { map, skipWhile, tap } from 'rxjs/operators';
import { Globals } from '../globals';
import { Bankaccountlist } from '../model/bankaccount';
import { SpinnerService } from '../spinner/spinner.service';


@Injectable({
    providedIn: 'root'
})
export class CommonService {
    /*readonly APIUrl = "https://localhost:44301/api";*/
    constructor(private http: HttpClient, private globals: Globals, private spinnerService: SpinnerService) { }


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

    getLinerNameList(OL: LinerName): Observable<LinerName[]> {

        return this.http.post<LinerName[]>(this.globals.APIURL + '/CommonAccessApi/CustomerBussTypesMaster', OL, this.createAuthHeader());
    }

    getModuleList(id): Observable<GeneralMaster[]> {

        return this.http.get<GeneralMaster[]>(this.globals.APIURL + '/CommonAccessApi/ModuleValues/' + id, this.createAuthHeader());
    }
    getProgramList(idv): Observable<GeneralMaster[]> {

        return this.http.get<GeneralMaster[]>(this.globals.APIURL + '/CommonAccessApi/ModuleValues/' + idv, this.createAuthHeader());
    }
    //getData() {
    //    return this.http.get('https://jsonplaceholder.typicode.com/users')
    //        .pipe(
    //            map((response: []) => response.map(item => item['name']))
    //        )
    //}

    //getData() {
    //    return this.http.get('http://test.oceanus-lines.com/api/CommonAccessApi/ModuleValues')
    //        .pipe(
    //            map((response: []) => response.map(item => item['LinerNmae']))
    //        )
    //}
    getData() {
        return this.http.get<LinerName[]>(this.globals.APIURL + '/CommonAccessApi/CustomerBussTypesMaster/', this.createAuthHeader())
            .pipe(
                map((response: []) => response.map(item => item['CustomerName']))
            )
    }

    getCategory(OL: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetCategory', OL);
    }

    getGSTCategory(OL: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetGSTCategory', OL);
    }

    getCompanyStatus(): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetCompanyStatus', this.createAuthHeader());
    }

    getCities(OL: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetCities', OL);
    }

    getSection(FormValue: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Dropdown/GetSection/', FormValue);
    }
    // * Entity Configurable Details (date, currency, fraction)
    getEntityConfigurableDetails(FormValue: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Organization/StaticEntityData', FormValue);
    }

    getDivision(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Division/GetOrganizationDivisionList', payload);
    }

    getOffice(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Office/GetOrganizationOfficeList', payload);
    }
    // * get entity configurable details form local storage
    getLocalStorageEntityConfigurable(key?) {
        // ! keys [CurrenecyFormat, DateFormat, NoOfFractions]
        let EntityConfigurable = localStorage.getItem('EntityConfigurable');
        if (EntityConfigurable) {
            EntityConfigurable = JSON.parse(EntityConfigurable);
        }
        if (key) {
            return EntityConfigurable[key] ? EntityConfigurable[key] : 'dd/mm/yyyy'
        } else {
            return EntityConfigurable ? EntityConfigurable : ''
        }
    }

    getOfficeByDivisionId(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetOfficeByDivisionId', payload);
    }

    getPeriodList(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetPeriodDropdownList', payload);
    }

    getOfficeByDivisionIds(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetOfficeByDivisionIds', payload);
    }

    panValidation(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetPanNoValidation', payload);
    }
    // bank list
    getBankAccountList(payload: Bankaccountlist): Observable<Bankaccountlist[]> {
        return this.http.post<Bankaccountlist[]>(this.globals.APIURL + '/Bank/GetBankList', payload);
    }

    getbankaccountFilter(OL: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Bank/GetBankFilter', OL);
    }

    getVendorListDropdown(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetVendorDropdownList', payload);
    }
    GetAllVendorDropdownList(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetAllVendorDropdownList', payload);
    }
    getStatusDropDownList(payLoad = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetStatusDropDownList', payLoad);
    }

    getGroupListDropdown(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetCOATypeDropDown', payload);
    }

    GetAccountBankList(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetBankListByDivisionAndOffice', payload);
    }

    getVendorDropdown(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetCustomerAndVendorByDivisionId', payload);
    }
    spinnerStart() {
        this.spinnerService.requestStarted();
    }

    SpinnerStop() {
        this.spinnerService.requestEnded();
    }

    getMultiSelectDivisionOfficeBankList(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetDropdownForBank', payload);
    }

    getBankByOfficeId(payload = {}): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetBankByOfficeId', payload);
    }

    getCustomerCreditList(payload: any): Observable<any[]> { // Days and Amount
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetCustomerCreditList', payload);
    }

    getCustomerList(payload: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetCustomerDropdownList', payload);
    }

    convertToLowerCaseDay(inputDate) {
        if (!inputDate) {
            inputDate = this.getLocalStorageEntityConfigurable('DateFormat')
        }
        // Replace 'DD' with 'dd' in the input date
        const formattedDate = inputDate.replace('DD', 'dd');
        return formattedDate;
    }

    convertToLowerCaseDayMonth(inputDate) {
        if (!inputDate) {
            inputDate = this.getLocalStorageEntityConfigurable('DateFormat')
        }
        const formattedDate = inputDate.replace(/DD/g, 'dd').replace(/YYYY/g, 'yyyy');

        // Replace 'DD' with 'dd' in the input date

        // console.log('convertToLowerCaseEntityDate', formattedDate)
        return formattedDate;
    }

    // User Role Permission details service
    GetUserPermissionObject(payload: any): Observable<any> {
        return this.http.post<any>(this.globals.APIURLLA + '/MenuMaster/UserPermissionObject', payload);
    }

    getLedgerMappingParentAccountList(payload): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetLedgerMappingParentAccountList', payload);
    }

    getChartaccountsFilter(): Observable<any[]> {

        let payLoad =
        {
            ChartOfAccountsId: 0,
            OrganizationName: '',
            AccountTypeID: 0,
            AccountCode: '',
            AccountName: '',
            IsSubAccount: 0,
            ParentAccount: 0,
            IsJobAccount: 0,
            DivisionName: '',
            IsPrincipal: 0,
            Principal: '',
            Remarks: '',
            IsActive: true,
            MainGroupID: 0,
            ShortName: '',
            AccountNameId: ''
        }
        return this.http.post<any[]>(this.globals.APIURL + '/ChartOfAccounts/GetChartOfAccountsFilter/', payLoad);
    }

    getFFGLActivityList(): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetFFGLActivityList', {});
    }
    
    GetCOAAccountList(payload: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetCOAAccountList', payload);
    }
   
    GetCOAAccountMappingList(payload: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.APIURL + '/Common/GetCOAAccountMappingList', payload);
    }
    
    SendToken(payload: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.SaApi + '/Home/GetAuthentication', payload);
    }
    
    getDeleteToken(payload: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.SaApi + '/Home/GetDeleteToken', payload);
    }
    GetInstanceLinks(payload: any): Observable<any[]> {
        return this.http.post<any[]>(this.globals.SaApi + '/SystemAdminApi/InstanceLinks', payload);
    }

}
