import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { SalesOffice, State } from 'src/app/model/org';
import { Globals } from '../globals';
import { Operator } from 'rxjs';

import { OrganizationGetDetails, OrganizationModel, OrgDetails } from '../model/OrgModel';
import { Bankaccountlist } from '../model/bankaccount';
import { BankaccountGetDetails, BankaccountModel } from '../model/Bankmodel';
import { Alerttype, AlerttypesSearch, Cargo, City, Commodity, ComponentMaster, ContainerType, ContLocationMaster, Country, CountrySearch, countryYearSearch, CTTypes, DamageMaster, Depot, DynamicGridManifest, DynamicGridNotes, DynamicGridOperator, DynamicGridSchedule, DynamicPDF1, FinancialYear, FinancialYearSearch, GeneralMaster, GetRegion, GetRegionSearch, Notes, NotesGrid, Organizationlist, Port, RepairMaster, ServiceSetup, SlotOperator, StateMaster, States, StatesSearch, Terminal, UOMMaster, Vessel, VoyageDetails } from '../model/Organzation';
import { DivisionMaster, OrganizationOfficeApi } from '../model/common';
@Injectable({
  providedIn: 'root'
})
export class MastersService {
    ORGANZATION: any;
    getFinancialLists(AlerttypeLook: AlerttypesSearch) {
      throw new Error('Method not implemented.');
    }

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
    getCountryList(OL: Country): Observable<Country[]> {

        return this.http.post<Country[]>(this.globals.APIURL + '/home/CountryView', OL,this.createAuthHeader());
    }

    getCountryEdit(OL: Country): Observable<Country[]> {
        return this.http.post<Country[]>(this.globals.APIURL + '/home/countryEdit',OL);
    }

    saveCtry(OD: Country) {

        return this.http.post(this.globals.APIURL + '/home/CountryInsert/',OD);
    }

    /*City*/

    getCityList(OL: City): Observable<City[]> {

        return this.http.post<City[]>(this.globals.APIURL + '/home/CityView', OL);
    }

    getCityEdit(OL: City): Observable<City[]> {
        return this.http.post<City[]>(this.globals.APIURL + '/home/CityEdit', OL);
    }
    saveCty(OD: City) {

        return this.http.post(this.globals.APIURL + '/home/City/', OD);
    }

    /*port*/
    getPortList(OL: Port): Observable<Port[]> {

        return this.http.post<Port[]>(this.globals.APIURL + '/home/Portview', OL);
    }

    getCountryBind(): Observable<Country[]> {

        return this.http.get<Country[]>(this.globals.SaApi + '/home/countryBind');
    }
    getPortEdit(OL: Port): Observable<Port[]>  {
        return this.http.post<Port[]>(this.globals.APIURL + '/home/Portviewedit', OL);

    }
    //getGeoLocByCountryBind(OL: MyAgency): Observable<MyAgency[]> {
    //    return this.http.post<MyAgency[]>(this.globals.APIURL + '/home/GeoLocByCountry' ,OL);
    //}

    getGeoLocByCountryBind(OL: SalesOffice): Observable<SalesOffice[]> {
        return this.http.post<SalesOffice[]>(this.globals.APIURL + '/OrgStructure/OfficeLocation', OL);
    }
    getGeoLocBind(OL: SalesOffice): Observable<SalesOffice[]> {
        return this.http.post<SalesOffice[]>(this.globals.APIURL + '/OrgStructure/OfficeLocationBind', OL);
    }

    savePort(OD: Port) {

        return this.http.post(this.globals.APIURL + '/home/Port/', OD);
    }

    /*Terminal*/

    getTerminalList(OL: Terminal): Observable<Terminal[]> {
        return this.http.post<Terminal[]>(this.globals.APIURL + '/home/TerminalView', OL);
    }

    getTerminaledit(OL: Terminal): Observable<Terminal[]> {
        return this.http.post<Terminal[]>(this.globals.APIURL + '/home/TerminalRecord', OL);
    }

    getPortBind(): Observable<Port[]> {
        return this.http.get<Port[]>(this.globals.APIURL + '/home/portBind');
    }

    saveTerminal(OD: Terminal) {

        return this.http.post(this.globals.APIURL + '/home/Terminal/', OD);
    }


    /*orangsation **/


    saveOrangsation(OL: OrganizationModel): Observable<OrganizationModel[]> {

        return this.http.post<OrganizationModel[]>(this.globals.APIURL + '/Organization/SaveOrganization/',OL);
    }

    getStateLists(OL: StatesSearch): Observable<States[]> {

        return this.http.post<States[]>(this.globals.APIURL + '/Dropdown/GetStates',OL);
    }

    getAlertLists(OL: AlerttypesSearch): Observable<Alerttype[]> {

        return this.http.post<Alerttype[]>(this.globals.APIURL + '/Dropdown/GetAlertType',OL);
    }

    getFinancialList(OL:FinancialYearSearch): Observable<FinancialYear[]> {

        return this.http.post<FinancialYear[]>(this.globals.APIURL + '/Dropdown/GetFinancialYear',OL);
    }

    getCountryLists(OL:CountrySearch): Observable<Country[]> {

        return this.http.post<Country[]>(this.globals.APIURL + '/Dropdown/GetCountry',OL);
    }
    getRegionalLists(OL:GetRegionSearch): Observable<GetRegion[]> {

        return this.http.post<GetRegion[]>(this.globals.APIURL + '/Dropdown/GetRegion',OL);
    }


    getoraganzationList(OL: Organizationlist): Observable<Organizationlist[]> {
        return this.http.post<Organizationlist[]>(this.globals.APIURL + '/Organization/GetOrganizationList', OL);
    }

    getOrganizationFilter(OL: Organizationlist): Observable<Organizationlist[]> {
        return this.http.post<Organizationlist[]>(this.globals.APIURL + '/Organization/GetOrganizationFilter', OL);
    }
/*Bankaccount */
getbankaccountList(OL: Bankaccountlist): Observable<Bankaccountlist[]> {
    return this.http.post<Bankaccountlist[]>(this.globals.APIURL + '/Bank/GetBankList', OL);
}
getbankaccountFilter(OL: Bankaccountlist): Observable< Bankaccountlist[]> {
    return this.http.post< Bankaccountlist[]>(this.globals.APIURL + '/Bank/GetBankFilter', OL);
}
saveaccount(OL: BankaccountModel): Observable<BankaccountModel[]> {

    return this.http.post<BankaccountModel[]>(this.globals.APIURL + '/Bank/SaveBank/',OL);
}
getBankaccountDetails(OL:BankaccountGetDetails): Observable< BankaccountGetDetails[]> {


    return this.http.post< BankaccountGetDetails[]>(this.globals.APIURL + '/Organization/GetBankId/',OL);

   0
}


    /*Commodity*/

    getCommodityList(OL: Commodity): Observable<Commodity[]> {
        return this.http.post<Commodity[]>(this.globals.APIURL + '/home/Commodityview', OL);
    }

    getCommodityedit(OL: Commodity): Observable<Commodity[]> {
        return this.http.post<Commodity[]>(this.globals.APIURL + '/home/Commodityviewedit', OL);
    }

    saveCommodity(OD: Commodity) {
        return this.http.post(this.globals.APIURL + '/home/Commodity', OD);
    }

    getCommodityTypes(OL: Commodity): Observable<Commodity[]> {
        return this.http.post<Commodity[]>(this.globals.APIURL + '/home/CommodityTypes', OL);
    }

    /*Cargo*/

    getCargoList(OL: Cargo): Observable<Cargo[]> {
        return this.http.post<Cargo[]>(this.globals.APIURL + '/home/CargoPkgview', OL);
    }

    getCargoedit(OL: Cargo): Observable<Cargo[]> {
        return this.http.post<Cargo[]>(this.globals.APIURL + '/home/CargoPkgviewedit', OL);
    }

    saveCargo(OD: Cargo) {
        return this.http.post(this.globals.APIURL + '/home/CargoPackage', OD);
    }


    /*UOMMaster*/

    saveUOM(OD: UOMMaster) {
        return this.http.post(this.globals.APIURL + '/home/UOMMaster', OD);
    }

    getUOMedit(OL: UOMMaster): Observable<UOMMaster[]> {
        return this.http.post<UOMMaster[]>(this.globals.APIURL + '/home/UOMMasterviewedit', OL);
    }

    getUOMList(OL: UOMMaster): Observable<UOMMaster[]> {
        return this.http.post<UOMMaster[]>(this.globals.APIURL + '/home/UOMMasterview', OL);
    }


    /*StateMaster*/

    saveState(OD: StateMaster) {
        return this.http.post(this.globals.APIURL + '/home/State', OD);
    }

    getStateedit(OL: StateMaster): Observable<StateMaster[]> {
        return this.http.post<StateMaster[]>(this.globals.APIURL + '/home/StateRecord', OL);
    }

    getStateList(OL: StateMaster): Observable<StateMaster[]> {
        return this.http.post<StateMaster[]>(this.globals.APIURL + '/home/StateView', OL);
    }

    getStateBind(): Observable<StateMaster[]> {
        return this.http.get<StateMaster[]>(this.globals.APIURL + '/home/stateBind');
    }
    getStatesBindByCtry(OL: State): Observable<State[]> {

        return this.http.post<State[]>(this.globals.APIURL + '/OrgStructure/BindStatesByCountry', OL, this.createAuthHeader());
    }

    /* Depot Master */

    getDepotList(OL: Depot): Observable<Depot[]> {
        return this.http.post<Depot[]>(this.globals.APIURL + '/home/DepotView', OL);
    }

    getDepotedit(OL: Depot): Observable<Depot[]> {
        return this.http.post<Depot[]>(this.globals.APIURL + '/home/DepotRecord', OL);
    }


    getDepoteditDtls(OL: Depot): Observable<Depot[]> {
        return this.http.post<Depot[]>(this.globals.APIURL + '/home/BindDepoMasterPortDtls', OL);
    }

    saveDepot(OD: Depot) {
        return this.http.post(this.globals.APIURL + '/home/Depot', OD);
    }

    getCityBind(OL: City): Observable<City[]> {
        return this.http.post<City[]>(this.globals.APIURL + '/home/cityBind', OL);
    }

    getPortByCountryBind(id): Observable<Depot[]> {
        return this.http.get<Depot[]>(this.globals.APIURL + '/home/PortByCountry/' + id);
    }


    getCityByCountryBind(id): Observable<City[]> {
        return this.http.get<City[]>(this.globals.APIURL + '/home/BindCities/' + id);
    }

    /*DamageMaster*/

    saveDamage(OD: DamageMaster) {
        return this.http.post(this.globals.APIURL + '/home/DamageMaster', OD);
    }

    getDamageedit(OL: DamageMaster): Observable<DamageMaster[]> {
        return this.http.post<DamageMaster[]>(this.globals.APIURL + '/home/DamageMasterviewedit', OL);
    }

    getDamageList(OL: DamageMaster): Observable<DamageMaster[]> {
        return this.http.post<DamageMaster[]>(this.globals.APIURL + '/home/DamageMasterview', OL);
    }

    /*RepairMaster*/

    saveRepair(OD: RepairMaster) {
        return this.http.post(this.globals.APIURL + '/home/RepairMaster', OD);
    }

    getRepairedit(OL: RepairMaster): Observable<RepairMaster[]> {
        return this.http.post<RepairMaster[]>(this.globals.APIURL + '/home/RepairMasterviewedit', OL);
    }

    getRepairList(OL: RepairMaster): Observable<RepairMaster[]> {
        return this.http.post<RepairMaster[]>(this.globals.APIURL + '/home/RepairMasterview', OL);
    }
    /*ContLocationMaster*/

    saveContLocation(OD: ContLocationMaster) {
        return this.http.post(this.globals.APIURL + '/home/ContLocationMaster', OD);
    }

    getContLocationedit(OL: ContLocationMaster): Observable<ContLocationMaster[]> {
        return this.http.post<ContLocationMaster[]>(this.globals.APIURL + '/home/ContLocationMasterviewedit', OL);
    }

    getContLocationList(OL: ContLocationMaster): Observable<ContLocationMaster[]> {
        return this.http.post<ContLocationMaster[]>(this.globals.APIURL + '/home/ContLocationMasterview', OL);
    }

    /*ComponentMaster*/

    saveComponent(OD: ComponentMaster) {
        return this.http.post(this.globals.APIURL + '/home/MNRComponentMaster', OD);
    }

    getComponentedit(OL: ComponentMaster): Observable<ComponentMaster[]> {
        return this.http.post<ComponentMaster[]>(this.globals.APIURL + '/home/MNRComponentViewEdit', OL);
    }

    getComponentList(OL: ComponentMaster): Observable<ComponentMaster[]> {
        return this.http.post<ComponentMaster[]>(this.globals.APIURL + '/home/MNRComponentView', OL);
    }

    getAssemblyBind(OL: GeneralMaster): Observable<GeneralMaster[]> {
        return this.http.post<GeneralMaster[]>(this.globals.APIURL + '/home/BindAssembly', OL);
    }

    getNotesList(OL: Notes): Observable<Notes[]> {
        return this.http.post<Notes[]>(this.globals.APIURL + '/home/NotesandClausesView', OL);
    }
    SaveNotes(OD: NotesGrid) {
        return this.http.post(this.globals.APIURL + '/home/NotesandClausesInsert', OD);
    }
    getNotesEditDtls(OL: NotesGrid): Observable<NotesGrid[]> {
        return this.http.post<NotesGrid[]>(this.globals.APIURL + '/home/ExistingNotesandClauses', OL);
    }

    DeleteNotes(OD: NotesGrid) {
        return this.http.post(this.globals.APIURL + '/home/NotesandClausesDelete', OD);
    }

    /*ContTypeMaster*/

    saveContType(OD: ContainerType) {
        return this.http.post(this.globals.APIURL + '/home/ContTypeMaster', OD);
    }

    getContTypeedit(OL: ContainerType): Observable<ContainerType[]> {
        return this.http.post<ContainerType[]>(this.globals.APIURL + '/home/ContTypeMasterviewedit', OL);
    }

    getContTypeList(OL: ContainerType): Observable<ContainerType[]> {
        return this.http.post<ContainerType[]>(this.globals.APIURL + '/home/ContTypeMasterview', OL);
    }

    getContainerTypes(OL: ContainerType): Observable<ContainerType[]> {
        return this.http.post<ContainerType[]>(this.globals.APIURL + '/home/CntrTypeValues', OL);
    }

    getContainerSize(OL: CTTypes): Observable<CTTypes[]> {
        return this.http.post<CTTypes[]>(this.globals.APIURL + '/home/ContainerSize', OL);
    }

    /*Vessel Master*/

    getVesselList(OL: ContainerType): Observable<Vessel[]> {
        return this.http.post<Vessel[]>(this.globals.APIURL + '/home/Vesselview', OL);
    }
    getVesseledit(OL: Vessel): Observable<Vessel[]> {
        return this.http.post<Vessel[]>(this.globals.APIURL + '/home/Vesselviewparticular', OL);
    }
    saveVessel(OD: Vessel) {
        return this.http.post(this.globals.APIURL + '/home/Vessel', OD);
    }

    /*Service Setup*/

    getServiceSetupList(OL: ServiceSetup): Observable<ServiceSetup[]> {
        return this.http.post<ServiceSetup[]>(this.globals.APIURL + '/home/ServiceSetupView', OL);
    }
    getServiceSetupedit(OL: ServiceSetup): Observable<ServiceSetup[]> {
        return this.http.post<ServiceSetup[]>(this.globals.APIURL + '/home/ServiceSetupEdit', OL);
    }
    saveServiceSetup(OD: ServiceSetup) {
        return this.http.post(this.globals.APIURL + '/home/InsertServiceSetup', OD);
    }
    getServiceSetupRoutedit(OL: ServiceSetup): Observable<ServiceSetup[]> {
        return this.http.post<ServiceSetup[]>(this.globals.APIURL + '/home/ServiceRouteEdit', OL);
    }
    getOperatorBind(OL: SlotOperator): Observable<SlotOperator[]> {
        return this.http.post<SlotOperator[]>(this.globals.APIURL + '/CommonAccessApi/CustomerBussTypesMaster', OL);
    }
    getServiceOperatoredit(OL: ServiceSetup): Observable<ServiceSetup[]> {
        return this.http.post<ServiceSetup[]>(this.globals.APIURL + '/home/ServiceOperatorsEdit', OL);
    }
    getServiceRouteDelete(OL: ServiceSetup): Observable<ServiceSetup[]> {
        return this.http.post<ServiceSetup[]>(this.globals.APIURL + '/home/ServiceRouteDelete', OL);
    }
    getServiceOperatorDelete(OL: ServiceSetup): Observable<ServiceSetup[]> {
        return this.http.post<ServiceSetup[]>(this.globals.APIURL + '/home/ServiceOperatorsDelete', OL);
    }

    /*Voyage Details*/

    getVoyageList(OL: VoyageDetails): Observable<VoyageDetails[]> {
        return this.http.post<VoyageDetails[]>(this.globals.APIURL + '/home/VoyageDetailsView', OL);
    }

    getServiceBind(OL: ServiceSetup): Observable<ServiceSetup[]> {
        return this.http.post<ServiceSetup[]>(this.globals.APIURL + '/home/BindServices', OL);
    }
    getVesselBind(OL: Vessel): Observable<Vessel[]> {
        return this.http.post<Vessel[]>(this.globals.APIURL + '/home/VesselDropDown', OL);
    }
    getPortbyServiceBind(OL: DynamicGridSchedule): Observable<DynamicGridSchedule[]> {
        return this.http.post<DynamicGridSchedule[]>(this.globals.APIURL + '/home/BindServiceSchedule', OL);
    }
    getTerminalbyPort(OL: Terminal): Observable<Terminal[]> {
        return this.http.post<Terminal[]>(this.globals.APIURL + '/home/BindTerminalByPort', OL);
    }
    saveVoyageDetails(OD: VoyageDetails) {
        return this.http.post(this.globals.APIURL + '/home/InsertVoyageFirstTab', OD);
    }

    getVoyageEdit(OL: VoyageDetails): Observable<VoyageDetails[]> {
        return this.http.post<VoyageDetails[]>(this.globals.APIURL + '/home/VoyageDetailsEdit', OL);
    }
    getVoyageDtlsEdit(OL: DynamicGridSchedule): Observable<DynamicGridSchedule[]> {
        return this.http.post<DynamicGridSchedule[]>(this.globals.APIURL + '/home/VoyageSailingDetailsEdit', OL);
    }

    saveVoyageOperator(OD: VoyageDetails) {
        return this.http.post(this.globals.APIURL + '/home/InsertOperatorServices', OD);
    }
    getVoyageOperatorEdit(OL: DynamicGridOperator): Observable<DynamicGridOperator[]> {
        return this.http.post<DynamicGridOperator[]>(this.globals.APIURL + '/home/VoyageOperatorsEdit', OL);
    }

    getVoyageOperatorDelete(OL: DynamicGridOperator): Observable<DynamicGridOperator[]> {
        return this.http.post<DynamicGridOperator[]>(this.globals.APIURL + '/home/VoyageOperatorsDelete', OL);
    }

    saveVoyageManifest(OD: DynamicGridManifest) {
        return this.http.post(this.globals.APIURL + '/home/InsertManifestDtls', OD);
    }
    getVoyageManifestEdit(OL: DynamicGridManifest): Observable<DynamicGridManifest[]> {
        return this.http.post<DynamicGridManifest[]>(this.globals.APIURL + '/home/ViewManifestDtls', OL);
    }
    getVoyageType(OL: GeneralMaster): Observable<GeneralMaster[]> {
        return this.http.post<GeneralMaster[]>(this.globals.APIURL + '/home/BindVoyageTypes', OL);
    }
    saveVoyageNotes(OD: DynamicGridNotes) {
        return this.http.post(this.globals.APIURL + '/home/InsertVoyageNotes', OD);
    }
    getVoyageNotesEdit(OL: DynamicGridNotes): Observable<DynamicGridNotes[]> {
        return this.http.post<DynamicGridNotes[]>(this.globals.APIURL + '/home/BindVoyageNotes', OL);
    }
    getVoyageNotesDelete(OL: DynamicGridNotes): Observable<DynamicGridNotes[]> {
        return this.http.post<DynamicGridNotes[]>(this.globals.APIURL + '/home/VoyageNotesDelete', OL);
    }

    getPDF(OL: DynamicPDF1): Observable<DynamicPDF1[]> {

        return this.http.post<DynamicPDF1[]>(this.globals.APIURL + '/home/BLPrintPDF', OL);
    }


    //Aravind
    getHSCode(OL: Commodity): Observable<Commodity[]> {
        return this.http.post<Commodity[]>(this.globals.APIURL + '/home/GetHSCode', OL);
    }
    getBusinessDivision(OL:DivisionMaster):Observable<DivisionMaster[]>{
        return this.http.post<DivisionMaster[]>(this.globals.APIURL + '/Dropdown/GetDivision', OL);

    }
    getParentsOffice(OL:OrganizationOfficeApi):Observable<OrganizationOfficeApi[]>{
        return this.http.post<OrganizationOfficeApi[]>(this.globals.APIURL + '/Dropdown/GetOrganizationOffice', OL);

    }
    getFinancialCountryList(OL:countryYearSearch): Observable<countryYearSearch[]> {

        return this.http.post<countryYearSearch[]>(this.globals.APIURL + '/Dropdown/GetFinancialYearByCountry',OL);
    }
    getOrangzationDetails(OL: OrganizationGetDetails): Observable<OrganizationGetDetails[]> {

        return this.http.post<OrganizationGetDetails[]>(this.globals.APIURL + '/Organization/GetOrganizationId/',OL);
    }

    OnBindDropdownCountry() {
        return this.http.post<Country>(this.globals.SaApi + '/SystemAdminApi/GetCountries', this.http.options);
    }

}
