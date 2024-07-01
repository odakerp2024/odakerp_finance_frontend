import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { LoginRoutingModule } from './login-routing.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { Globals } from './globals'
import { MatDatepickerModule } from '@angular/material/datepicker';
//import { NgSelect2Module } from 'ng-select2';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { CountryComponent } from './views/masters/commonmaster/country/country.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Countryview1Component } from './views/masters/commonmaster/country/countryview1/countryview1.component';
import { CityComponent } from './views/masters/commonmaster/city/city.component';
import { CityviewComponent } from './views/masters/commonmaster/city/cityview/cityview.component';
import { CommodityComponent } from './views/masters/commonmaster/commodity/commodity.component';
import { CommodityviewComponent } from './views/masters/commonmaster/commodity/commodityview/commodityview.component';
import { CargopackageComponent } from './views/masters/commonmaster/cargopackage/cargopackage.component';
import { CargopackageviewComponent } from './views/masters/commonmaster/cargopackage/cargopackageview/cargopackageview.component';
import { DepotComponent } from './views/masters/LAmaster/depot/depot.component';
import { DepotviewComponent } from './views/masters/LAmaster/depot/depotview/depotview.component';
import { PortComponent } from './views/masters/commonmaster/port/port.component';
import { PortviewComponent } from './views/masters/commonmaster/port/portview/portview.component';
import { TerminalComponent } from './views/masters/commonmaster/terminal/terminal.component';
import { TerminalviewComponent } from './views/masters/commonmaster/terminal/terminalview/terminalview.component';
import { UommasterComponent } from './views/masters/commonmaster/uommaster/uommaster.component';
import { UommasterviewComponent } from './views/masters/commonmaster/uommaster/uommasterview/uommasterview.component';
import { StatemasterComponent } from './views/masters/commonmaster/statemaster/statemaster.component';
import { StatemasterviewComponent } from './views/masters/commonmaster/statemaster/statemasterview/statemasterview.component';
import { ContypemasterComponent } from './views/masters/commonmaster/contypemaster/contypemaster.component';
import { ContypemasterviewComponent } from './views/masters/commonmaster/contypemaster/contypemasterview/contypemasterview.component';
import { MatSelectModule } from '@angular/material/select';
import { ControlparameterComponent } from './views/administration/systemmaster/controlparameter/controlparameter.component';
import { LoginComponent } from './login/login.component';
import { AuthguardServiceService } from './authguard-service.service';
import { MatDialogModule, MatCheckboxModule, MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { PopupComponent } from './popup/popup.component';
import { InstanceprofileComponent } from './views/administration/systemmaster/instanceprofile/instanceprofile.component';
import { EmailconfigComponent } from './views/administration/systemmaster/emailconfig/emailconfig.component';
import { AppconfigComponent } from './views/administration/systemmaster/appconfig/appconfig.component';
import { DocumentnumberingComponent } from './views/administration/systemmaster/documentnumbering/documentnumbering.component';
import { NotesclauseComponent } from './views/administration/systemmaster/notesclause/notesclause.component';
import { UserprofileComponent } from './views/administration/userconfig/userprofile/userprofile.component';
import { RolemanagementComponent } from './views/administration/userconfig/rolemanagement/rolemanagement.component';
import { NotificationComponent } from './views/administration/userconfig/notification/notification.component';
import { UserlogreportComponent } from './views/administration/userconfig/userlogreport/userlogreport.component';
import { AppconfigviewComponent } from './views/administration/systemmaster/appconfig/appconfigview/appconfigview.component';
import { ControlparameterviewComponent } from './views/administration/systemmaster/controlparameter/controlparameterview/controlparameterview.component';
import { DocumentnumberingviewComponent } from './views/administration/systemmaster/documentnumbering/documentnumberingview/documentnumberingview.component';
import { EmailconfigviewComponent } from './views/administration/systemmaster/emailconfig/emailconfigview/emailconfigview.component';
import { InstanceprofileviewComponent } from './views/administration/systemmaster/instanceprofile/instanceprofileview/instanceprofileview.component';
import { NotesclauseviewComponent } from './views/administration/systemmaster/notesclause/notesclauseview/notesclauseview.component';
import { NotificationviewComponent } from './views/administration/userconfig/notification/notificationview/notificationview.component';
import { RolemanagmentviewComponent } from './views/administration/userconfig/rolemanagement/rolemanagmentview/rolemanagmentview.component';
import { UserlogreportviewComponent } from './views/administration/userconfig/userlogreport/userlogreportview/userlogreportview.component';
import { UserprofileviewComponent } from './views/administration/userconfig/userprofile/userprofileview/userprofileview.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ViewsComponent } from './views/views.component';
import { MastersComponent } from './views/masters/masters.component';
import { CommonmasterComponent } from './views/masters/commonmaster/commonmaster.component';

import { ContainermasterComponent } from './views/masters/LAmaster/containermaster/containermaster.component';
import { InventorymoveComponent } from './views/masters/LAmaster/inventorymove/inventorymove.component';
import { VesselComponent } from './views/masters/LAmaster/vessel/vessel.component';
import { VoyageComponent } from './views/masters/LAmaster/voyage/voyage.component';
import { RoutedeclareComponent } from './views/masters/LAmaster/routedeclare/routedeclare.component';
import { PorttariffComponent } from './views/masters/LAmaster/porttariff/porttariff.component';
import { SlotcontractComponent } from './views/masters/LAmaster/slotcontract/slotcontract.component';
import { IHChaulageComponent } from './views/masters/LAmaster/ihchaulage/ihchaulage.component';
import { DetdemComponent } from './views/masters/LAmaster/detdem/detdem.component';
import { ContaineryardComponent } from './views/masters/LAmaster/containeryard/containeryard.component';
import { DamagemasterComponent } from './views/masters/LAmaster/damagemaster/damagemaster.component';
import { RepairmasterComponent } from './views/masters/LAmaster/repairmaster/repairmaster.component';
import { ComponentmasterComponent } from './views/masters/LAmaster/componentmaster/componentmaster.component';
import { ContainerlocComponent } from './views/masters/LAmaster/containerloc/containerloc.component';
import { MnrtariffComponent } from './views/masters/LAmaster/mnrtariff/mnrtariff.component';
import { AdministrationComponent } from './views/administration/administration.component';
import { SystemmasterComponent } from './views/administration/systemmaster/systemmaster.component';
import { EmailcenterComponent } from './views/administration/systemmaster/emailconfig/emailcenter/emailcenter.component';
import { OrgstructComponent } from './views/administration/orgstruct/orgstruct.component';
import { OrgsetupComponent } from './views/administration/orgstruct/orgsetup/orgsetup.component';
import { OfficemasterComponent } from './views/administration/orgstruct/orgsetup/officemaster/officemaster.component';
import { OfficemasterviewComponent } from './views/administration/orgstruct/orgsetup/officemaster/officemasterview/officemasterview.component';
import { OrgmasterComponent } from './views/administration/orgstruct/orgsetup/orgmaster/orgmaster.component';
import { OrgmasterviewComponent } from './views/administration/orgstruct/orgsetup/orgmaster/orgmasterview/orgmasterview.component';
import { RegionmasterComponent } from './views/administration/orgstruct/orgsetup/regionmaster/regionmaster.component';
import { RegionmasterviewComponent } from './views/administration/orgstruct/orgsetup/regionmaster/regionmasterview/regionmasterview.component';
import { SalesmasterComponent } from './views/administration/orgstruct/orgsetup/salesmaster/salesmaster.component';
import { SalesmasterviewComponent } from './views/administration/orgstruct/orgsetup/salesmaster/salesmasterview/salesmasterview.component';
import { DamagemasterviewComponent } from './views/masters/LAmaster/damagemaster/damagemasterview/damagemasterview.component';
import { RepairmasterviewComponent } from './views/masters/LAmaster/repairmaster/repairmasterview/repairmasterview.component';
import { ComponentmasterviewComponent } from './views/masters/LAmaster/componentmaster/componentmasterview/componentmasterview.component';
import { ContainerlocviewComponent } from './views/masters/LAmaster/containerloc/containerlocview/containerlocview.component';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { MatInputModule } from '@angular/material/input';
import { PorttariffviewComponent } from './views/masters/LAmaster/porttariff/porttariffview/porttariffview.component';
import { LinercostComponent } from './views/masters/LAmaster/porttariff/linercost/linercost.component';
import { TerminalcostComponent } from './views/masters/LAmaster/porttariff/terminalcost/terminalcost.component';
import { DetentionComponent } from './views/masters/LAmaster/porttariff/detention/detention.component';
import { StorageComponent } from './views/masters/LAmaster/porttariff/storage/storage.component';
import { IhcComponent } from './views/masters/LAmaster/porttariff/ihc/ihc.component';
import { OthersComponent } from './views/masters/LAmaster/porttariff/others/others.component';
import { PrincipleagreementComponent } from './views/masters/LAmaster/porttariff/principleagreement/principleagreement.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PartymasterComponent } from './views/masters/commonmaster/partymaster/partymaster.component';
import { PartymasterviewComponent } from './views/masters/commonmaster/partymaster/partymasterview/partymasterview.component';
import { VendorComponent } from './views/masters/commonmaster/vendor/vendor.component';
import { VendorviewComponent } from './views/masters/commonmaster/vendor/vendorview/vendorview.component';
import { PrincipalagencyComponent } from './views/masters/LAmaster/principalagency/principalagency.component';
import { PrincipalagencyviewComponent } from './views/masters/LAmaster/principalagency/principalagencyview/principalagencyview.component';
import { PrincipaldetailsComponent } from './views/masters/LAmaster/principalagency/principaldetails/principaldetails.component';
import { PortdetailsComponent } from './views/masters/LAmaster/principalagency/portdetails/portdetails.component';
import { PrincipalagreementComponent } from './views/masters/LAmaster/principalagency/principalagreement/principalagreement.component';
import { AttachmentsComponent } from './views/masters/LAmaster/principalagency/attachments/attachments.component';
import { AlertmailsComponent } from './views/masters/LAmaster/principalagency/alertmails/alertmails.component';
import { VesselviewComponent } from './views/masters/LAmaster/vessel/vesselview/vesselview.component';
import { ServicesetupComponent } from './views/masters/LAmaster/servicesetup/servicesetup.component';
import { ServicesetupviewComponent } from './views/masters/LAmaster/servicesetup/servicesetupview/servicesetupview.component';

import { AgencymasterComponent } from './views/masters/LAmaster/agencymaster/agencymaster.component';
import { AgencymasterviewComponent } from './views/masters/LAmaster/agencymaster/agencymasterview/agencymasterview.component';
import { ContainermasterviewComponent } from './views/masters/LAmaster/containermaster/containermasterview/containermasterview.component';
import { InventorymoveviewComponent } from './views/masters/LAmaster/inventorymove/inventorymoveview/inventorymoveview.component';
import { VoyageviewComponent } from './views/masters/LAmaster/voyage/voyageview/voyageview.component';
import { BOLComponent } from './views/masters/commonmaster/bol/bol.component';
import { EnquiriesBookingComponent } from './views/enquiries-booking/enquiries-booking.component';
import { EnquiriesComponent } from './views/enquiries-booking/enquiries/enquiries.component';
import { RateapprovalsComponent } from './views/enquiries-booking/rateapprovals/rateapprovals.component';
import { CustomercontractComponent } from './views/enquiries-booking/customercontract/customercontract.component';
import { CustomercontractviewComponent } from './views/enquiries-booking/customercontract/customercontractview/customercontractview.component';
import { EnquiriesviewComponent } from './views/enquiries-booking/enquiries/enquiriesview/enquiriesview.component';
import { RateapprovalsviewComponent } from './views/enquiries-booking/rateapprovals/rateapprovalsview/rateapprovalsview.component';
import { ScreenconfigurationComponent } from './views/enquiries-booking/screenconfiguration/screenconfiguration.component';
import { SlotmanagementComponent } from './views/slotmanagement/slotmanagement.component';
import { SlotmanagementviewComponent } from './views/slotmanagement/slotmanagementview/slotmanagementview.component';
import { BookingComponent } from './views/enquiries-booking/booking/booking.component';
import { BookingviewComponent } from './views/enquiries-booking/booking/bookingview/bookingview.component';
import { ExportmanagerComponent } from './views/exportmanager/exportmanager.component';
import { BookinglevelComponent } from './views/exportmanager/bookinglevel/bookinglevel.component';
import { VessellevelComponent } from './views/exportmanager/vessellevel/vessellevel.component';
import { AccountingComponent } from './views/exportmanager/accounting/accounting.component';
import { BookinglevelviewComponent } from './views/exportmanager/bookinglevel/bookinglevelview/bookinglevelview.component';
import { BookingsComponent } from './views/exportmanager/bookinglevel/bookings/bookings.component';
import { ContainersComponent } from './views/exportmanager/bookinglevel/containers/containers.component';
import { LoadlistComponent } from './views/exportmanager/bookinglevel/loadlist/loadlist.component';
import { BolComponent } from './views/exportmanager/bookinglevel/bol/bol.component';
import { BlreleaseComponent } from './views/exportmanager/bookinglevel/blrelease/blrelease.component';
import { InvoicesComponent } from './views/exportmanager/bookinglevel/invoices/invoices.component';
import { ContdetailsComponent } from './views/exportmanager/bookinglevel/containers/contdetails/contdetails.component';
import { BoldetailsComponent } from './views/exportmanager/bookinglevel/bol/boldetails/boldetails.component';
import { BlreldetailsComponent } from './views/exportmanager/bookinglevel/blrelease/blreldetails/blreldetails.component';
import { ExphandlingdetailsComponent } from './views/exportmanager/bookinglevel/exphandling/exphandlingdetails/exphandlingdetails.component';
import { InvdetailsComponent } from './views/exportmanager/bookinglevel/invoices/invdetails/invdetails.component';
import { HazComponent } from './views/exportmanager/bookinglevel/loadlist/haz/haz.component';
import { OogComponent } from './views/exportmanager/bookinglevel/loadlist/oog/oog.component';
import { ReeferComponent } from './views/exportmanager/bookinglevel/loadlist/reefer/reefer.component';
import { OdoComponent } from './views/exportmanager/bookinglevel/loadlist/odo/odo.component';
import { CROEntryComponent } from './views/enquiries-booking/croentry/croentry.component';
import { CROViewComponent } from './views/enquiries-booking/croentry/croview/croview.component';
import { ExphandlingComponent } from './views/exportmanager/bookinglevel/exphandling/exphandling.component';
import { AttachComponent } from './views/exportmanager/bookinglevel/attach/attach.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingInterceptor, Spinner } from './spinner/spinner';
import { BlallotmentComponent } from './views/exportmanager/bookinglevel/blallotment/blallotment.component';
import { VsloadlistComponent } from './views/exportmanager/vessellevel/vsloadlist/vsloadlist.component';
import { VsprealertComponent } from './views/exportmanager/vessellevel/vsprealert/vsprealert.component';
import { VsloadcnfrmComponent } from './views/exportmanager/vessellevel/vsloadcnfrm/vsloadcnfrm.component';
import { VsexphandlingComponent } from './views/exportmanager/vessellevel/vsexphandling/vsexphandling.component';
import { VstdrComponent } from './views/exportmanager/vessellevel/vstdr/vstdr.component';
import { VsonboardComponent } from './views/exportmanager/vessellevel/vsonboard/vsonboard.component';
import { VessellevelviewComponent } from './views/exportmanager/vessellevel/vessellevelview/vessellevelview.component';
import { PrealertmailComponent } from './views/exportmanager/vessellevel/vsprealert/prealertmail/prealertmail.component';
import { OnboardmailComponent } from './views/exportmanager/vessellevel/vsonboard/onboardmail/onboardmail.component';
import { CntrpickupdropviewComponent } from './views/inventory/cntrpickupdropview/cntrpickupdropview.component';
import { CntrpickupdropComponent } from './views/inventory/cntrpickupdrop/cntrpickupdrop.component';
import { CntrmovementComponent } from './views/inventory/cntrmovement/cntrmovement.component';
import { CntrmovementviewComponent } from './views/inventory/cntrmovement/cntrmovementview/cntrmovementview.component';
import { CntruploadComponent } from './views/inventory/cntrmovement/cntrupload/cntrupload.component';
import { CntrmovementconfigComponent } from './views/inventory/cntrmovementconfig/cntrmovementconfig.component';
import { CntrmovementconfigviewComponent } from './views/inventory/cntrmovementconfig/cntrmovementconfigview/cntrmovementconfigview.component';
import { StoragelocationtypeComponent } from './views/masters/commonmaster/storagelocationtype/storagelocationtype.component';
import { StoragelocationtypeviewComponent } from './views/masters/commonmaster/storagelocationtype/storagelocationtypeview/storagelocationtypeview.component';
import { TdrmailComponent } from './views/exportmanager/vessellevel/vstdr/tdrmail/tdrmail.component';
import { PrealertfinalComponent } from './views/exportmanager/vessellevel/vsprealert/prealertfinal/prealertfinal.component';
import { TdrfinalComponent } from './views/exportmanager/vessellevel/vstdr/tdrfinal/tdrfinal.component';
import { LoadcnfrmstsComponent } from './views/exportmanager/vessellevel/vsloadcnfrm/loadcnfrmsts/loadcnfrmsts.component';
import { InventoryComponent } from './views/inventory/inventory.component';
import { LoadlistmailComponent } from './views/exportmanager/vessellevel/vsloadlist/loadlistmail/loadlistmail.component';
import { FinancialyearComponent } from './views/finance/master/financialyear/financialyear.component';
import { FinancialyearviewComponent } from './views/finance/master/financialyear/financialyearview/financialyearview.component';
import { ChartaccountsComponent } from './views/finance/master/chartaccounts/chartaccounts.component';
import { ChartaccountsviewComponent } from './views/finance/master/chartaccounts/chartaccountsview/chartaccountsview.component';
import { BankAccountComponent } from './views/finance/master/bank-account/bank-account.component';
import { BankAccountviewComponent } from './views/finance/master/bank-account/bank-accountview/bank-accountview.component';
import { TaxlistComponent } from './views/finance/master/taxlist/taxlist.component';
import { TaxlistviewComponent } from './views/finance/master/taxlist/taxlistview/taxlistview.component';
import { OrganizationComponent } from './views/finance/master/organization/organization.component';
import { OrganizationviewComponent } from './views/finance/master/organization/organizationview/organizationview.component';
import { SACComponent } from './views/finance/master/sac/sac.component';
import { SACviewComponent } from './views/finance/master/sac/sacview/sacview.component';
import { ChargecodeComponent } from './views/finance/master/chargecode/chargecode.component';
import { TDSComponent } from './views/finance/master/tds/tds.component';
import { TdsviewComponent } from './views/finance/master/tds/tdsview/tdsview.component';
import { ChargecodeviewComponent } from './views/finance/master/chargecode/chargecodeview/chargecodeview.component';
import { ExchangeRateComponent } from './views/finance/master/exchange-rate/exchange-rate.component';
import { ExchangeRateviewComponent } from './views/finance/master/exchange-rate/exchange-rateview/exchange-rateview.component';
import { FinanceMasterComponent } from './views/finance/master/financemaster.component';
import { CustomerComponent } from './views/finance/master/customer/customer.component';
import { CustomerviewComponent } from './views/finance/master/customer/customerview/customerview.component';
import { TaxgroupComponent } from './views/finance/master/taxgroup/taxgroup.component';
import { TaxgroupviewComponent } from './views/finance/master/taxgroup/taxgroupview/taxgroupview.component';
import { TwodigitdecimalnumberDirective } from './views/finance/master/taxgroup/twodigitdecimalnumber.directive';
import { VendorsComponent } from './views/finance/master/vendors/vendors.component';
import { VendorsviewComponent } from './views/finance/master/vendors/vendorsview/vendorsview.component';
import { ChartaccountcodeviewComponent } from './views/finance/master/chartaccountcode/chartaccountcodeview/chartaccountcodeview.component';
import { ChartaccountcodelistComponent } from './views/finance/master/chartaccountcode/chartaccountcodelist.component';
import { EntityModule } from './views/finance/master/entity/entity.module';
import { LamasterComponent } from './views/masters/LAmaster/lamaster.component';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from './shared/shared.module';
import { DatePipe } from '@angular/common';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from './directive/directive.module';
import { PaymentVoucherDetailsComponent } from './views/finance/transactions/payment-vouchers/payment-voucher-details/payment-voucher-details.component';
import { PaymentVoucherViewComponent } from './views/finance/transactions/payment-vouchers/payment-voucher-view/payment-voucher-view.component';
import { TrialbalancetwoComponent } from './views/finance/reports/leveltwo/trialbalancetwo/trialbalancetwo.component';
import { TrailbalanceComponent } from './views/finance/reports/levelone/trailbalance/trailbalance.component';
import { GSTOutputRegisterComponent } from './views/finance/reports/gstoutput-register/gstoutput-register.component';
import { GSTInputRegisterComponent } from './views/finance/reports/gstinput-register/gstinput-register.component';
import { TDSPayableComponent } from './views/finance/reports/tdspayable/tdspayable.component';
import { TDSReceivableComponent } from './views/finance/reports/tdsreceivable/tdsreceivable.component';
const EntityConfigurable = localStorage.getItem('EntityConfigurable');
const EntityDateFormat = JSON.parse(EntityConfigurable)?.DateFormat;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    // dateInput: 'DD-MM-YYYY',
    // dateInput: 'YYYY/MM/DD',
    dateInput:  EntityDateFormat,
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [

    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    HeaderComponent,
    SidenavComponent,
    SideMenuComponent,
    CountryComponent,
    Countryview1Component,
    CityComponent,
    CityviewComponent,

    CommodityComponent,
    CommodityviewComponent,
    CargopackageComponent,
    CargopackageviewComponent,
    DepotComponent,
    DepotviewComponent,
    PortComponent,
    PortviewComponent,
    TerminalComponent,
    TerminalviewComponent,

    ControlparameterComponent,
    LoginComponent,
    PopupComponent,
    InstanceprofileComponent,
    EmailconfigComponent,
    AppconfigComponent,
    DocumentnumberingComponent,
    NotesclauseComponent,
    UserprofileComponent,
    RolemanagementComponent,
    NotificationComponent,
    UserlogreportComponent,
    AppconfigviewComponent,
    ControlparameterviewComponent,
    DocumentnumberingviewComponent,
    EmailconfigviewComponent,
    InstanceprofileviewComponent,
    NotesclauseviewComponent,
    NotificationviewComponent,
    RolemanagmentviewComponent,
    UserlogreportviewComponent,
    UserprofileviewComponent,
    ViewsComponent,
    MastersComponent,
    CommonmasterComponent,
    LamasterComponent,
    ContainermasterComponent,
    InventorymoveComponent,
    VesselComponent,
    VoyageComponent,
    RoutedeclareComponent,
    PorttariffComponent,
    SlotcontractComponent,
    IHChaulageComponent,
    DetdemComponent,
    ContaineryardComponent,
    DamagemasterComponent,
    RepairmasterComponent,
    ComponentmasterComponent,
    ContainerlocComponent,
    MnrtariffComponent,
    AdministrationComponent,
    SystemmasterComponent,
    EmailcenterComponent,
    OrgstructComponent,
    OrgsetupComponent,
    OfficemasterComponent,
    OfficemasterviewComponent,
    OrgmasterComponent,
    OrgmasterviewComponent,
    RegionmasterComponent,
    RegionmasterviewComponent,
    SalesmasterComponent,
    SalesmasterviewComponent,
    UommasterComponent,
    UommasterviewComponent,
    StatemasterComponent,
    StatemasterviewComponent,
    ContypemasterComponent,
    ContypemasterviewComponent,
    DamagemasterviewComponent,
    RepairmasterviewComponent,
    ComponentmasterviewComponent,
    ContainerlocviewComponent,
    PorttariffviewComponent,
    LinercostComponent,
    TerminalcostComponent,
    DetentionComponent,
    StorageComponent,
    IhcComponent,
    OthersComponent,
    PrincipleagreementComponent,
    DashboardComponent,
    PartymasterviewComponent,
    PartymasterComponent,
    VendorviewComponent,
    VendorComponent,
    PrincipalagencyComponent,
    PrincipalagencyviewComponent,
    PrincipaldetailsComponent,
    PortdetailsComponent,
    PrincipalagreementComponent,
    AttachmentsComponent,
    AlertmailsComponent,
    VesselviewComponent,
    ServicesetupComponent,
    ServicesetupviewComponent,
    AgencymasterComponent,
    AgencymasterviewComponent,
    ContainermasterviewComponent,
    InventorymoveviewComponent,
    VoyageviewComponent,
    BOLComponent,
    EnquiriesBookingComponent,
    EnquiriesComponent,
    RateapprovalsComponent,
    CustomercontractComponent,
    CustomercontractviewComponent,
    EnquiriesviewComponent,
    RateapprovalsviewComponent,
    ScreenconfigurationComponent,
    SlotmanagementComponent,
    SlotmanagementviewComponent,
    BookingComponent,
    BookingviewComponent,
    ExportmanagerComponent,
    BookinglevelComponent,
    VessellevelComponent,
    AccountingComponent,
    BookinglevelviewComponent,
    BookingsComponent,
    ContainersComponent,
    LoadlistComponent,
    BolComponent,
    BlreleaseComponent,
    ExphandlingComponent,
    InvoicesComponent,
    ContdetailsComponent,
    BoldetailsComponent,
    BlreldetailsComponent,
    ExphandlingdetailsComponent,
    InvdetailsComponent,
    HazComponent,
    OogComponent,
    ReeferComponent,
    OdoComponent,
    CROEntryComponent,
    CROViewComponent,
    AttachComponent,
    SpinnerComponent,
    BlallotmentComponent,
    VsloadlistComponent,
    VsprealertComponent,
    VsloadcnfrmComponent,
    VsexphandlingComponent,
    VstdrComponent,
    VsonboardComponent,
    VessellevelviewComponent,
    PrealertmailComponent,
    OnboardmailComponent,
    CntrpickupdropviewComponent,
    CntrpickupdropComponent,
    CntrmovementComponent,
    CntrmovementviewComponent,
    CntruploadComponent,
    CntrmovementconfigComponent,
    CntrmovementconfigviewComponent,
    StoragelocationtypeComponent,
    StoragelocationtypeviewComponent,
    TdrmailComponent,
    PrealertfinalComponent,
    TdrfinalComponent,
    LoadcnfrmstsComponent,
    InventoryComponent,
    LoadlistmailComponent,
    FinancialyearComponent,
    FinancialyearviewComponent,
    ChartaccountsComponent,
    ChartaccountsviewComponent,
    BankAccountComponent,
    BankAccountviewComponent,
    TaxlistComponent,
    TaxlistviewComponent,
    OrganizationComponent,
    OrganizationviewComponent,
    SACComponent,
    SACviewComponent,
    ChargecodeComponent,
    TDSComponent,
    TdsviewComponent,
    ChargecodeviewComponent,
    ExchangeRateComponent,
    ExchangeRateviewComponent,
    FinanceMasterComponent,
    CustomerComponent,
    CustomerviewComponent,
    TaxgroupComponent,
    TaxgroupviewComponent,
    TwodigitdecimalnumberDirective,
    VendorsComponent,
    VendorsviewComponent,
    ChartaccountcodeviewComponent,
    ChartaccountcodelistComponent,
    TrialbalancetwoComponent,
    TrailbalanceComponent,
    GSTOutputRegisterComponent,
    GSTInputRegisterComponent,
    TDSPayableComponent,
    TDSReceivableComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    AppRoutingModule,
    LoginRoutingModule,
    FormsModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatToolbarModule,
    MatButtonModule,
    MatDatepickerModule,
    RouterModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    SelectAutocompleteModule,
    MatCheckboxModule,
    MatInputModule,
    DirectiveModule,
    //NgSelect2Module,

    // Entity Module
    EntityModule,
    MatChipsModule,
    //

    //RouterModule.forRoot([
    //  { path: '', component: HomeComponent, pathMatch: 'full' },
    //  { path: 'counter', component: CounterComponent },
    //    { path: 'fetch-data', component: FetchDataComponent },
    //    { path: 'masters/country/countryview', component: CountryviewComponent },
    //    { path: 'masters/country/countryview1', component: Countryview1Component },
    //]),
    BrowserAnimationsModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule, //
    NgSelectModule
  ],
  providers: [AuthguardServiceService, EncrDecrServiceService, Globals, Title, LoadingInterceptor, Spinner, DatePipe ,
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
      { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ],
  bootstrap: [AppComponent],
  exports:[MatDatepickerModule, MatInputModule]

})
export class AppModule { }
