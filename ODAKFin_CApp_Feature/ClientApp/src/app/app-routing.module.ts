import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { CountryComponent } from './views/masters/commonmaster/country/country.component';
import { Countryview1Component } from './views/masters/commonmaster/country/countryview1/countryview1.component';
import { CityComponent } from './views/masters/commonmaster/city/city.component';
import { CityviewComponent } from './views/masters/commonmaster/city/cityview/cityview.component';
import { CommodityComponent } from './views/masters/commonmaster/commodity/commodity.component';
import { CommodityviewComponent } from './views/masters/commonmaster/commodity/commodityview/commodityview.component';
import { CargopackageComponent } from './views/masters/commonmaster/cargopackage/cargopackage.component';
import { CargopackageviewComponent } from './views/masters/commonmaster/cargopackage/cargopackageview/cargopackageview.component';
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

import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from './authentication.guard';
import { PopupComponent } from './popup/popup.component';
import { ViewsComponent } from './views/views.component';
import { MastersComponent } from './views/masters/masters.component';
import { ContainermasterComponent } from './views/masters/LAmaster/containermaster/containermaster.component';
import { ContaineryardComponent } from './views/masters/LAmaster/containeryard/containeryard.component';
import { DepotComponent } from './views/masters/LAmaster/depot/depot.component';
import { DepotviewComponent } from './views/masters/LAmaster/depot/depotview/depotview.component';
import { DetdemComponent } from './views/masters/LAmaster/detdem/detdem.component';
import { IHChaulageComponent } from './views/masters/LAmaster/ihchaulage/ihchaulage.component';
import { InventorymoveComponent } from './views/masters/LAmaster/inventorymove/inventorymove.component';
import { MnrtariffComponent } from './views/masters/LAmaster/mnrtariff/mnrtariff.component';
import { PorttariffComponent } from './views/masters/LAmaster/porttariff/porttariff.component';
import { RoutedeclareComponent } from './views/masters/LAmaster/routedeclare/routedeclare.component';
import { SlotcontractComponent } from './views/masters/LAmaster/slotcontract/slotcontract.component';
import { VesselComponent } from './views/masters/LAmaster/vessel/vessel.component';

import { InstanceprofileComponent } from './views/administration/systemmaster/instanceprofile/instanceprofile.component';
import { InstanceprofileviewComponent } from './views/administration/systemmaster/instanceprofile/instanceprofileview/instanceprofileview.component';
import { AppconfigviewComponent } from './views/administration/systemmaster/appconfig/appconfigview/appconfigview.component';
import { AppconfigComponent } from './views/administration/systemmaster/appconfig/appconfig.component';
import { ControlparameterComponent } from './views/administration/systemmaster/controlparameter/controlparameter.component';
import { ControlparameterviewComponent } from './views/administration/systemmaster/controlparameter/controlparameterview/controlparameterview.component';
import { DocumentnumberingComponent } from './views/administration/systemmaster/documentnumbering/documentnumbering.component';
import { DocumentnumberingviewComponent } from './views/administration/systemmaster/documentnumbering/documentnumberingview/documentnumberingview.component';
import { EmailconfigComponent } from './views/administration/systemmaster/emailconfig/emailconfig.component';
import { EmailconfigviewComponent } from './views/administration/systemmaster/emailconfig/emailconfigview/emailconfigview.component';
import { NotesclauseComponent } from './views/administration/systemmaster/notesclause/notesclause.component';
import { NotesclauseviewComponent } from './views/administration/systemmaster/notesclause/notesclauseview/notesclauseview.component';
import { NotificationComponent } from './views/administration/userconfig/notification/notification.component';
import { RolemanagementComponent } from './views/administration/userconfig/rolemanagement/rolemanagement.component';
import { RolemanagmentviewComponent } from './views/administration/userconfig/rolemanagement/rolemanagmentview/rolemanagmentview.component';
import { UserlogreportComponent } from './views/administration/userconfig/userlogreport/userlogreport.component';
import { UserlogreportviewComponent } from './views/administration/userconfig/userlogreport/userlogreportview/userlogreportview.component';
import { UserprofileComponent } from './views/administration/userconfig/userprofile/userprofile.component';
import { UserprofileviewComponent } from './views/administration/userconfig/userprofile/userprofileview/userprofileview.component';
import { AdministrationComponent } from './views/administration/administration.component';
import { CommonmasterComponent } from './views/masters/commonmaster/commonmaster.component';

import { SystemmasterComponent } from './views/administration/systemmaster/systemmaster.component';
import { EmailcenterComponent } from './views/administration/systemmaster/emailconfig/emailcenter/emailcenter.component';
import { OfficemasterviewComponent } from './views/administration/orgstruct/orgsetup/officemaster/officemasterview/officemasterview.component';
import { OfficemasterComponent } from './views/administration/orgstruct/orgsetup/officemaster/officemaster.component';
import { OrgmasterComponent } from './views/administration/orgstruct/orgsetup/orgmaster/orgmaster.component';
import { OrgmasterviewComponent } from './views/administration/orgstruct/orgsetup/orgmaster/orgmasterview/orgmasterview.component';
import { RegionmasterviewComponent } from './views/administration/orgstruct/orgsetup/regionmaster/regionmasterview/regionmasterview.component';
import { RegionmasterComponent } from './views/administration/orgstruct/orgsetup/regionmaster/regionmaster.component';
import { SalesmasterviewComponent } from './views/administration/orgstruct/orgsetup/salesmaster/salesmasterview/salesmasterview.component';
import { SalesmasterComponent } from './views/administration/orgstruct/orgsetup/salesmaster/salesmaster.component';
import { OrgstructComponent } from './views/administration/orgstruct/orgstruct.component';
import { PorttariffviewComponent } from './views/masters/LAmaster/porttariff/porttariffview/porttariffview.component';
import { LinercostComponent } from './views/masters/LAmaster/porttariff/linercost/linercost.component';
import { TerminalcostComponent } from './views/masters/LAmaster/porttariff/terminalcost/terminalcost.component';
import { DetentionComponent } from './views/masters/LAmaster/porttariff/detention/detention.component';
import { IhcComponent } from './views/masters/LAmaster/porttariff/ihc/ihc.component';
import { OthersComponent } from './views/masters/LAmaster/porttariff/others/others.component';
import { PrincipleagreementComponent } from './views/masters/LAmaster/porttariff/principleagreement/principleagreement.component';
import { StorageComponent } from './views/masters/LAmaster/porttariff/storage/storage.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ComponentmasterComponent } from './views/masters/LAmaster/componentmaster/componentmaster.component';
import { ComponentmasterviewComponent } from './views/masters/LAmaster/componentmaster/componentmasterview/componentmasterview.component';
import { ContainerlocComponent } from './views/masters/LAmaster/containerloc/containerloc.component';
import { ContainerlocviewComponent } from './views/masters/LAmaster/containerloc/containerlocview/containerlocview.component';
import { DamagemasterComponent } from './views/masters/LAmaster/damagemaster/damagemaster.component';
import { DamagemasterviewComponent } from './views/masters/LAmaster/damagemaster/damagemasterview/damagemasterview.component';
import { RepairmasterComponent } from './views/masters/LAmaster/repairmaster/repairmaster.component';
import { RepairmasterviewComponent } from './views/masters/LAmaster/repairmaster/repairmasterview/repairmasterview.component';

import { PartymasterComponent } from './views/masters/commonmaster/partymaster/partymaster.component';
import { PartymasterviewComponent } from './views/masters/commonmaster/partymaster/partymasterview/partymasterview.component';
import { VendorviewComponent } from './views/masters/commonmaster/vendor/vendorview/vendorview.component';
import { VendorComponent } from './views/masters/commonmaster/vendor/vendor.component';
import { PrincipalagencyComponent } from './views/masters/LAmaster/principalagency/principalagency.component';
import { PrincipalagencyviewComponent } from './views/masters/LAmaster/principalagency/principalagencyview/principalagencyview.component';
import { PrincipaldetailsComponent } from './views/masters/LAmaster/principalagency/principaldetails/principaldetails.component';
import { PortdetailsComponent } from './views/masters/LAmaster/principalagency/portdetails/portdetails.component';
import { PrincipalagreementComponent } from './views/masters/LAmaster/principalagency/principalagreement/principalagreement.component';
import { AttachmentsComponent } from './views/masters/LAmaster/principalagency/attachments/attachments.component';
import { AlertmailsComponent } from './views/masters/LAmaster/principalagency/alertmails/alertmails.component';
import { VesselviewComponent } from './views/masters/LAmaster/vessel/vesselview/vesselview.component';
import { ServicesetupviewComponent } from './views/masters/LAmaster/servicesetup/servicesetupview/servicesetupview.component';
import { ServicesetupComponent } from './views/masters/LAmaster/servicesetup/servicesetup.component';
import { AgencymasterComponent } from './views/masters/LAmaster/agencymaster/agencymaster.component';
import { AgencymasterviewComponent } from './views/masters/LAmaster/agencymaster/agencymasterview/agencymasterview.component';
import { ContainermasterviewComponent } from './views/masters/LAmaster/containermaster/containermasterview/containermasterview.component';
import { InventorymoveviewComponent } from './views/masters/LAmaster/inventorymove/inventorymoveview/inventorymoveview.component';
import { VoyageComponent } from './views/masters/LAmaster/voyage/voyage.component';
import { VoyageviewComponent } from './views/masters/LAmaster/voyage/voyageview/voyageview.component';
import { BOLComponent } from './views/masters/commonmaster/bol/bol.component';
import { EnquiriesBookingComponent } from './views/enquiries-booking/enquiries-booking.component';
import { CustomercontractComponent } from './views/enquiries-booking/customercontract/customercontract.component';
import { EnquiriesComponent } from './views/enquiries-booking/enquiries/enquiries.component';
import { RateapprovalsComponent } from './views/enquiries-booking/rateapprovals/rateapprovals.component';
import { CustomercontractviewComponent } from './views/enquiries-booking/customercontract/customercontractview/customercontractview.component';
import { EnquiriesviewComponent } from './views/enquiries-booking/enquiries/enquiriesview/enquiriesview.component';
import { RateapprovalsviewComponent } from './views/enquiries-booking/rateapprovals/rateapprovalsview/rateapprovalsview.component';
import { ScreenconfigurationComponent } from './views/enquiries-booking/screenconfiguration/screenconfiguration.component';
import { SlotmanagementviewComponent } from './views/slotmanagement/slotmanagementview/slotmanagementview.component';
import { SlotmanagementComponent } from './views/slotmanagement/slotmanagement.component';
import { BookingComponent } from './views/enquiries-booking/booking/booking.component';
import { BookingviewComponent } from './views/enquiries-booking/booking/bookingview/bookingview.component';
import { BookinglevelComponent } from './views/exportmanager/bookinglevel/bookinglevel.component';
import { VessellevelComponent } from './views/exportmanager/vessellevel/vessellevel.component';
import { AccountingComponent } from './views/exportmanager/accounting/accounting.component';
import { BlreleaseComponent } from './views/exportmanager/bookinglevel/blrelease/blrelease.component';
import { BlreldetailsComponent } from './views/exportmanager/bookinglevel/blrelease/blreldetails/blreldetails.component';
import { BookinglevelviewComponent } from './views/exportmanager/bookinglevel/bookinglevelview/bookinglevelview.component';
import { BookingsComponent } from './views/exportmanager/bookinglevel/bookings/bookings.component';
import { ContainersComponent } from './views/exportmanager/bookinglevel/containers/containers.component';
import { ContdetailsComponent } from './views/exportmanager/bookinglevel/containers/contdetails/contdetails.component';
import { ExphandlingComponent } from './views/exportmanager/bookinglevel/exphandling/exphandling.component';
import { ExphandlingdetailsComponent } from './views/exportmanager/bookinglevel/exphandling/exphandlingdetails/exphandlingdetails.component';
import { InvoicesComponent } from './views/exportmanager/bookinglevel/invoices/invoices.component';
import { InvdetailsComponent } from './views/exportmanager/bookinglevel/invoices/invdetails/invdetails.component';
import { LoadlistComponent } from './views/exportmanager/bookinglevel/loadlist/loadlist.component';
import { HazComponent } from './views/exportmanager/bookinglevel/loadlist/haz/haz.component';
import { OdoComponent } from './views/exportmanager/bookinglevel/loadlist/odo/odo.component';
import { OogComponent } from './views/exportmanager/bookinglevel/loadlist/oog/oog.component';
import { ReeferComponent } from './views/exportmanager/bookinglevel/loadlist/reefer/reefer.component';
import { CROEntryComponent } from './views/enquiries-booking/croentry/croentry.component';
import { CROViewComponent } from './views/enquiries-booking/croentry/croview/croview.component';
import { BolComponent } from './views/exportmanager/bookinglevel/bol/bol.component';
import { BoldetailsComponent } from './views/exportmanager/bookinglevel/bol/boldetails/boldetails.component';
import { AttachComponent } from './views/exportmanager/bookinglevel/attach/attach.component';
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
import { StoragelocationtypeComponent } from './views/masters/commonmaster/storagelocationtype/storagelocationtype.component';
import { StoragelocationtypeviewComponent } from './views/masters/commonmaster/storagelocationtype/storagelocationtypeview/storagelocationtypeview.component';
import { TdrmailComponent } from './views/exportmanager/vessellevel/vstdr/tdrmail/tdrmail.component';
import { PrealertfinalComponent } from './views/exportmanager/vessellevel/vsprealert/prealertfinal/prealertfinal.component';
import { TdrfinalComponent } from './views/exportmanager/vessellevel/vstdr/tdrfinal/tdrfinal.component';
import { LoadcnfrmstsComponent } from './views/exportmanager/vessellevel/vsloadcnfrm/loadcnfrmsts/loadcnfrmsts.component';
import { InventoryComponent } from './views/inventory/inventory.component';
import { LoadlistmailComponent } from './views/exportmanager/vessellevel/vsloadlist/loadlistmail/loadlistmail.component';
import { FinancialyearviewComponent } from './views/finance/master/financialyear/financialyearview/financialyearview.component';
import { FinancialyearComponent } from './views/finance/master/financialyear/financialyear.component';
import { BankAccountviewComponent } from './views/finance/master/bank-account/bank-accountview/bank-accountview.component';
import { BankAccountComponent } from './views/finance/master/bank-account/bank-account.component';
import { ChartaccountsviewComponent } from './views/finance/master/chartaccounts/chartaccountsview/chartaccountsview.component';
import { ChartaccountsComponent } from './views/finance/master/chartaccounts/chartaccounts.component';
import { TaxlistviewComponent } from './views/finance/master/taxlist/taxlistview/taxlistview.component';
import { TaxlistComponent } from './views/finance/master/taxlist/taxlist.component';
import { OrganizationviewComponent } from './views/finance/master/organization/organizationview/organizationview.component';
import { OrganizationComponent } from './views/finance/master/organization/organization.component';
import { SACComponent } from './views/finance/master/sac/sac.component';
import { SACviewComponent } from './views/finance/master/sac/sacview/sacview.component';
import { TdsviewComponent } from './views/finance/master/tds/tdsview/tdsview.component';
import { TDSComponent } from './views/finance/master/tds/tds.component';
import { ChargecodeviewComponent } from './views/finance/master/chargecode/chargecodeview/chargecodeview.component';
import { ChargecodeComponent } from './views/finance/master/chargecode/chargecode.component';
import { ExchangeRateviewComponent } from './views/finance/master/exchange-rate/exchange-rateview/exchange-rateview.component';
import { ExchangeRateComponent } from './views/finance/master/exchange-rate/exchange-rate.component';
import { FinanceMasterComponent } from './views/finance/master/financemaster.component';
import { CustomerviewComponent } from './views/finance/master/customer/customerview/customerview.component';
import { CustomerComponent } from './views/finance/master/customer/customer.component';
import { TaxgroupComponent } from './views/finance/master/taxgroup/taxgroup.component';
import { TaxgroupviewComponent } from './views/finance/master/taxgroup/taxgroupview/taxgroupview.component';
import { VendorsviewComponent } from './views/finance/master/vendors/vendorsview/vendorsview.component';
import { VendorsComponent } from './views/finance/master/vendors/vendors.component';
import { ChartaccountcodeviewComponent } from './views/finance/master/chartaccountcode/chartaccountcodeview/chartaccountcodeview.component';
import { ChartaccountcodelistComponent } from './views/finance/master/chartaccountcode/chartaccountcodelist.component';
import { LamasterComponent } from './views/masters/LAmaster/lamaster.component';
const routes: Routes = [

    { path: '', redirectTo: "/login", pathMatch: 'full' },
    { path: 'login', component: LoginComponent },


    {
        path: 'views', component: ViewsComponent, canActivate: [AuthenticationGuard],

        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'administration/administration', component: AdministrationComponent },
            { path: 'administration/systemmaster', component: SystemmasterComponent },
            { path: 'administration/orgstruct', component: OrgstructComponent },
            { path: 'administration/systemmaster/appconfig/appconfig', component: AppconfigComponent },
            { path: 'administration/systemmaster/appconfig/appconfigview', component: AppconfigviewComponent },
            { path: 'administration/systemmaster/controlparameter/controlparameter', component: ControlparameterComponent },
            { path: 'administration/systemmaster/controlparameter/controlparameterview', component: ControlparameterviewComponent },
            { path: 'administration/systemmaster/documentnumbering/documentnumbering', component: DocumentnumberingComponent },
            { path: 'administration/systemmaster/documentnumbering/documentnumberingview', component: DocumentnumberingviewComponent },
            { path: 'administration/systemmaster/emailconfig/emailconfig', component: EmailconfigComponent },
            { path: 'administration/systemmaster/emailconfig/emailconfigview', component: EmailconfigviewComponent },
            { path: 'administration/systemmaster/instanceprofile/instanceprofileview', component: InstanceprofileviewComponent },
            { path: 'administration/systemmaster/instanceprofile/instanceprofile', component: InstanceprofileComponent },
            { path: 'administration/systemmaster/notesclause/notesclause', component: NotesclauseComponent },
            { path: 'administration/systemmaster/notesclause/notesclauseview', component: NotesclauseviewComponent },
            { path: 'administration/systemmaster/emailconfig/emailcenter/emailcenter', component: EmailcenterComponent },
            { path: 'administration/userconfig/notification/notification', component: NotificationComponent },
            { path: 'administration/userconfig/notification/notificationview', component: NotesclauseviewComponent },
            { path: 'administration/userconfig/rolemanagement/rolemanagement', component: RolemanagementComponent },
            { path: 'administration/userconfig/rolemanagement/rolemanagementview', component: RolemanagmentviewComponent },
            { path: 'administration/userconfig/userlogreport/userlogreport', component: UserlogreportComponent },
            { path: 'administration/userconfig/userlogreport/userlogreportview', component: UserlogreportviewComponent },
            { path: 'administration/userconfig/userprofile/userprofile', component: UserprofileComponent },
            { path: 'administration/userconfig/userprofile/userprofileview', component: UserprofileviewComponent },
            { path: 'administration/orgstruct/orgsetup/officemaster/officemasterview', component: OfficemasterviewComponent },
            { path: 'administration/orgstruct/orgsetup/officemaster/officemaster', component: OfficemasterComponent },
            { path: 'administration/orgstruct/orgsetup/orgmaster/orgmasterview', component: OrgmasterviewComponent },
            { path: 'administration/orgstruct/orgsetup/orgmaster/orgmaster', component: OrgmasterComponent },
            { path: 'administration/orgstruct/orgsetup/regionmaster/regionmasterview', component: RegionmasterviewComponent },
            { path: 'administration/orgstruct/orgsetup/regionmaster/regionmaster', component: RegionmasterComponent },
            { path: 'administration/orgstruct/orgsetup/salesmaster/salesmasterview', component: SalesmasterviewComponent },
            { path: 'administration/orgstruct/orgsetup/salesmaster/salesmaster', component: SalesmasterComponent },
            { path: 'masters/commonmaster', component: CommonmasterComponent },
            { path: 'masters/LAmaster', component: LamasterComponent },
            { path: 'masters/commonmaster/country/country', component: CountryComponent },
            { path: 'masters/commonmaster/country/countryview1', component: Countryview1Component },
            { path: 'masters/commonmaster/country/country', component: CountryComponent },
            { path: 'masters/masters', component: MastersComponent },

            { path: 'masters/commonmaster/city/city', component: CityComponent },
            { path: 'masters/commonmaster/city/cityview', component: CityviewComponent },
            { path: 'masters/commonmaster/commodity/commodity', component: CommodityComponent },
            { path: 'masters/commonmaster/commodity/commodityview', component: CommodityviewComponent },
            { path: 'masters/commonmaster/cargopackage/cargopackage', component: CargopackageComponent },
            { path: 'masters/commonmaster/cargopackage/cargopackageview', component: CargopackageviewComponent },
            { path: 'masters/commonmaster/port/port', component: PortComponent },
            { path: 'masters/commonmaster/port/portview', component: PortviewComponent },
            { path: 'masters/commonmaster/terminal/terminal', component: TerminalComponent },
            { path: 'masters/commonmaster/terminal/terminalview', component: TerminalviewComponent },
            { path: 'masters/LAmaster/repairmaster/repairmaster', component: RepairmasterComponent },
            { path: 'masters/LAmaster/repairmaster/repairmasterview', component: RepairmasterviewComponent },
            { path: 'masters/commonmaster/uommaster/uommaster', component: UommasterComponent },
            { path: 'masters/commonmaster/uommaster/uommasterview', component: UommasterviewComponent },
            { path: 'masters/commonmaster/statemaster/statemaster', component: StatemasterComponent },
            { path: 'masters/commonmaster/statemaster/statemasterview', component: StatemasterviewComponent },
            { path: 'masters/commonmaster/contypemaster/contypemaster', component: ContypemasterComponent },
            { path: 'masters/commonmaster/contypemaster/contypemasterview', component: ContypemasterviewComponent },



            { path: 'masters/LAmaster/componentmaster/componentmaster', component: ComponentmasterComponent },
            { path: 'masters/LAmaster/componentmaster/componentmasterview', component: ComponentmasterviewComponent },
            { path: 'masters/LAmaster/containerloc/containerloc', component: ContainerlocComponent },
            { path: 'masters/LAmaster/containerloc/containerlocview', component: ContainerlocviewComponent },
            { path: 'masters/LAmaster/componentmaster/containermaster', component: ContainermasterComponent },
            { path: 'masters/LAmaster/componentmaster/containeryard', component: ContaineryardComponent },
            { path: 'masters/LAmaster/damagemaster/damagemaster', component: DamagemasterComponent },
            { path: 'masters/LAmaster/damagemaster/damagemasterview', component: DamagemasterviewComponent },
            { path: 'masters/LAmaster/depot/depot', component: DepotComponent },
            { path: 'masters/LAmaster/depot/depotview', component: DepotviewComponent },
            { path: 'masters/LAmaster/componentmaster/componentmaster', component: ComponentmasterComponent },
            { path: 'masters/LAmaster/componentmaster/detdem', component: DetdemComponent },
            { path: 'masters/LAmaster/componentmaster/ihchaulage', component: IHChaulageComponent },
            { path: 'masters/LAmaster/componentmaster/mnrtariff', component: MnrtariffComponent },
            { path: 'masters/LAmaster/porttariff/porttariff', component: PorttariffComponent },
            { path: 'masters/LAmaster/porttariff/porttariffview', component: PorttariffviewComponent },
            { path: 'masters/LAmaster/damagemaster/damagemaster', component: DamagemasterComponent },
            { path: 'masters/LAmaster/damagemaster/damagemasterview', component: DamagemasterviewComponent },
            { path: 'masters/LAmaster/componentmaster/routedeclare', component: RoutedeclareComponent },
            { path: 'masters/LAmaster/componentmaster/slotcontract', component: SlotcontractComponent },
            { path: 'masters/LAmaster/componentmaster/vessel', component: VesselComponent },

            { path: 'masters/LAmaster/porttariff/linercost/linercost', component: LinercostComponent },
            { path: 'masters/LAmaster/porttariff/porttariff/terminalcost/terminalcost', component: TerminalcostComponent },
            { path: 'masters/LAmaster/porttariff/porttariff/linercost/linercost', component: DetentionComponent },
            { path: 'masters/LAmaster/porttariff/porttariff/ihc/ihc', component: IhcComponent },
            { path: 'masters/LAmaster/porttariff/porttariff/others/others', component: OthersComponent },
            { path: 'masters/LAmaster/porttariff/porttariff/principleagreement/principleagreement', component: PrincipleagreementComponent },
            { path: 'masters/LAmaster/porttariff/porttariff/storage/storage', component: StorageComponent },
            { path: 'masters/LAmaster/repairmaster/repairmaster', component: RepairmasterComponent },
            { path: 'masters/LAmaster/repairmaster/repairmasterview', component: RepairmasterviewComponent },
            { path: 'masters/LAmaster/componentmaster/componentmaster', component: ComponentmasterComponent },
            { path: 'masters/LAmaster/componentmaster/componentmasterview', component: ComponentmasterviewComponent },
            { path: 'masters/LAmaster/containerloc/containerloc', component: ContainerlocComponent },
            { path: 'masters/LAmaster/containerloc/containerlocview', component: ContainerlocviewComponent },
            { path: 'masters/LAmaster/containermaster/containermaster', component: ContainermasterComponent },
            { path: 'masters/LAmaster/containermaster/containermasterview', component: ContainermasterviewComponent },

            { path: 'masters/LAmaster/damagemaster/damagemaster', component: DamagemasterComponent },
            { path: 'masters/LAmaster/damagemaster/damagemasterview', component: DamagemasterviewComponent },
            { path: 'masters/commonmaster/partymaster/partymaster', component: PartymasterComponent },
            { path: 'masters/commonmaster/partymaster/partymasterview', component: PartymasterviewComponent },
            { path: 'masters/commonmaster/vendor/vendor', component: VendorComponent },
            { path: 'masters/commonmaster/vendor/vendorview', component: VendorviewComponent },

            { path: 'masters/LAmaster/Principalagency/Principalagency', component: PrincipalagencyComponent },
            { path: 'masters/LAmaster/Principalagency/Principalagencyview', component: PrincipalagencyviewComponent },
            { path: 'masters/LAmaster/Principalagency/Principaldetails/Principaldetails', component: PrincipaldetailsComponent },
            { path: 'masters/LAmaster/Principalagency/Portdetails/Portdetails', component: PortdetailsComponent },
            { path: 'masters/LAmaster/Principalagency/Principalagreement/Principalagreement', component: PrincipalagreementComponent },
            { path: 'masters/LAmaster/Principalagency/Attachments/Attachments', component: AttachmentsComponent },
            { path: 'masters/LAmaster/Principalagency/Alertmails/Alertmails', component: AlertmailsComponent },

            { path: 'masters/LAmaster/vessel/vesselview', component: VesselviewComponent },
            { path: 'masters/LAmaster/vessel/vessel', component: VesselComponent },
            { path: 'masters/LAmaster/voyage/voyageview', component: VoyageviewComponent },
            { path: 'masters/LAmaster/voyage/voyage', component: VoyageComponent },
            { path: 'masters/LAmaster/servicesetup/servicesetupview', component: ServicesetupviewComponent },
            { path: 'masters/LAmaster/servicesetup/servicesetup', component: ServicesetupComponent },

            { path: 'masters/LAmaster/agencymaster/agencymaster', component: AgencymasterComponent },
            { path: 'masters/LAmaster/agencymaster/agencymasterview', component: AgencymasterviewComponent },
            { path: 'masters/LAmaster/voyage/voyage', component: VoyageComponent },
            { path: 'masters/LAmaster/inventorymove/inventorymove', component: InventorymoveComponent },
            { path: 'masters/LAmaster/inventorymove/inventorymoveview', component: InventorymoveviewComponent },
            { path: 'masters/commonmaster/bol/bol', component: BOLComponent },
            { path: 'enquiries-booking/enquiries-booking', component: EnquiriesBookingComponent },
            { path: 'enquiries-booking/customercontract/customercontract', component: CustomercontractComponent },
            { path: 'enquiries-booking/enquiries/enquiries', component: EnquiriesComponent },
            { path: 'enquiries-booking/rateapprovals/rateapprovals', component: RateapprovalsComponent },
            { path: 'enquiries-booking/customercontract/customercontractview/customercontractview', component: CustomercontractviewComponent },
            { path: 'enquiries-booking/enquiries/enquiriesview/enquiriesview', component: EnquiriesviewComponent },
            { path: 'enquiries-booking/rateapprovals/rateapprovalsview/rateapprovalsview', component: RateapprovalsviewComponent },
            { path: 'enquiries-booking/screenconfiguration/screenconfiguration', component: ScreenconfigurationComponent },
            { path: 'slotmanagement/slotmanagementview/slotmanagementview', component: SlotmanagementviewComponent },
            { path: 'slotmanagement/slotmanagement', component: SlotmanagementComponent },
            { path: 'enquiries-booking/booking/booking', component: BookingComponent },
            { path: 'enquiries-booking/booking/bookingview/bookingview', component: BookingviewComponent },
            { path: 'exportmanager/bookinglevel/bookinglevel', component: BookinglevelComponent },
            { path: 'exportmanager/vessellevel/vessellevel', component: VessellevelComponent },
            { path: 'exportmanager/accounting/accounting', component: AccountingComponent },
            { path: 'exportmanager/bookinglevel/attachments/attachments', component: AttachmentsComponent },
            { path: 'exportmanager/bookinglevel/blrelease/blrelease', component: BlreleaseComponent },
            { path: 'exportmanager/bookinglevel/blrelease/blreleasedetails/blreleasedetails', component: BlreldetailsComponent },
            { path: 'exportmanager/bookinglevel/bol/bol', component: BolComponent },
            { path: 'exportmanager/bookinglevel/bol/boldetails/boldetails', component: BoldetailsComponent },
            { path: 'exportmanager/bookinglevel/bookinglevelview/bookinglevelview', component: BookinglevelviewComponent },
            { path: 'exportmanager/bookinglevel/bookings/bookings', component: BookingsComponent },
            { path: 'exportmanager/bookinglevel/containers/containers', component: ContainersComponent },
            { path: 'exportmanager/bookinglevel/containers/contdetails/contdetails', component: ContdetailsComponent },
            { path: 'exportmanager/bookinglevel/exphandling/exphandling', component: ExphandlingComponent },
            { path: 'exportmanager/bookinglevel/exphandling/exphandlingdetails/exphandlingdetails', component: ExphandlingdetailsComponent },
            { path: 'exportmanager/bookinglevel/invoices/invoices', component: InvoicesComponent },
            { path: 'exportmanager/bookinglevel/invoices/invdetails/invdetails', component: InvdetailsComponent },
            { path: 'exportmanager/bookinglevel/loadlist/loadlist', component: LoadlistComponent },
            { path: 'exportmanager/bookinglevel/loadlist/haz/haz', component: HazComponent },
            { path: 'exportmanager/bookinglevel/loadlist/odo/odo', component: OdoComponent },
            { path: 'exportmanager/bookinglevel/loadlist/oog/oog', component: OogComponent },
            { path: 'exportmanager/bookinglevel/loadlist/reefer/reefer', component: ReeferComponent },
            { path: 'enquiries-booking/croentry/croentry', component: CROEntryComponent },
            { path: 'enquiries-booking/croentry/croview/croview', component: CROViewComponent },
            { path: 'exportmanager/bookinglevel/attach/attach', component: AttachComponent },
            { path: 'exportmanager/bookinglevel/blallotment/blallotment', component: BlallotmentComponent },
            { path: 'exportmanager/vessellevel/vsloadlist/vsloadlist', component: VsloadlistComponent },
            { path: 'exportmanager/vessellevel/vsprealert/vsprealert', component: VsprealertComponent },
            { path: 'exportmanager/vessellevel/vsprealert/prealertmail/prealertmail', component: PrealertmailComponent },
            { path: 'exportmanager/vessellevel/vsloadcnfrm/vsloadcnfrm', component: VsloadcnfrmComponent },
            { path: 'exportmanager/vessellevel/vsexphandling/vsexphandling', component: VsexphandlingComponent },
            { path: 'exportmanager/vessellevel/vstdr/vstdr', component: VstdrComponent },
            { path: 'exportmanager/vessellevel/vsonboard/vsonboard', component: VsonboardComponent },
            { path: 'exportmanager/vessellevel/vsonboard/onboardmail/onboardmail', component: OnboardmailComponent },
            { path: 'exportmanager/vessellevel/vessellevelview/vessellevelview', component: VessellevelviewComponent },
            { path: 'inventory/cntrpickupdrop/cntrpickupdrop', component: CntrpickupdropComponent },
            { path: 'inventory/cntrpickupdropview/cntrpickupdropview', component: CntrpickupdropviewComponent },
            { path: 'inventory/cntrmovement/cntrmovement', component: CntrmovementComponent },
            { path: 'inventory/cntrmovement/cntrmovementview/cntrmovementview', component: CntrmovementviewComponent },
            { path: 'inventory/cntrmovement/cntrupload/cntrupload', component: CntruploadComponent },
            { path: 'masters/commonmaster/storagelocationtype/storagelocationtype', component: StoragelocationtypeComponent },
            { path: 'masters/commonmaster/storagelocationtype/storagelocationtypeview/storagelocationtypeview', component: StoragelocationtypeviewComponent },
            { path: 'exportmanager/vessellevel/vstdr/tdrmail/tdrmail', component: TdrmailComponent },
            { path: 'exportmanager/vessellevel/vessellevelview/vessellevelview', component: VessellevelviewComponent },
            { path: 'exportmanager/vessellevel/vsprealert/prealertfinal/prealertfinal', component: PrealertfinalComponent },
            { path: 'exportmanager/vessellevel/vstdr/tdrfinal/tdrfinal', component: TdrfinalComponent },
            { path: 'exportmanager/vessellevel/vsloadcnfrm/loadcnfrmsts/loadcnfrmsts', component: LoadcnfrmstsComponent },
            { path: 'inventory/inventory', component: InventoryComponent },
            { path: 'exportmanager/vessellevel/vsloadlist/loadlistmail/loadlistmail', component: LoadlistmailComponent },

            /* Finance Module - Start */
            { path: 'finance/financemaster', component: FinanceMasterComponent },
            { path: 'finance/master/bank-account/bank-accountview', component: BankAccountviewComponent },
            { path: 'finance/master/bank-account/bank-account', component: BankAccountComponent },
            { path: 'finance/master/bank-account/bank-account/:id', component: BankAccountComponent },

            { path: 'finance/master/chartaccounts/chartaccountsView', component: ChartaccountsviewComponent },
            { path: 'finance/master/chartaccounts/chartaccounts', component: ChartaccountsComponent },

            { path: 'finance/financialyearview', component: FinancialyearviewComponent },
            { path: 'finance/master/financialyear/financialyear', component: FinancialyearComponent },

            { path: 'finance/master/taxlist/taxlistView', component: TaxlistviewComponent },
            { path: 'finance/master/taxlist/taxlist', component: TaxlistComponent },
            { path: 'finance/master/taxlist/taxlist/:id', component: TaxlistComponent },

            { path: 'finance/master/organization/organizationview', component: OrganizationviewComponent },
            { path: 'finance/master/organization', component: OrganizationComponent },
            { path: 'finance/master/organization/:id', component: OrganizationComponent },

            { path: 'finance/master/SAC/SACview', component: SACviewComponent },
            { path: 'finance/master/SAC', component: SACComponent },

            { path: 'finance/master/tds/tdsview', component: TdsviewComponent },
            { path: 'finance/master/tds', component: TDSComponent },

            { path: 'finance/master/chargecode/chargecodeview', component: ChargecodeviewComponent },
            { path: 'finance/master/chargecode', component: ChargecodeComponent },

            { path: 'finance/master/exchangerate/exchangerateview', component: ExchangeRateviewComponent },
            { path: 'finance/master/exchangerate', component: ExchangeRateComponent },

            { path: 'finance/Customer/Customerview', component: CustomerviewComponent },
            { path: 'finance/Customer', component: CustomerComponent },

            { path: 'finance/Vendor/Vendorview', component: VendorsviewComponent },
            { path: 'finance/Vendor', component: VendorsComponent },

            { path: 'finance/master/taxgroup/taxgroupview', component: TaxgroupviewComponent },
            { path: 'finance/master/taxgroup/taxgroup', component: TaxgroupComponent },
            { path: 'finance/master/taxgroup/taxgroup/:id', component: TaxgroupComponent },

            { path: 'finance/master/chartaccountcode/chartaccountcodeview', component: ChartaccountcodeviewComponent },
            { path: 'finance/master/chartaccountcode/chartaccountcodelist', component: ChartaccountcodelistComponent },
            /* Finance Module - End */

            /** Lazy Loading modules **/
            { path: 'entity', loadChildren: () => import('./views/finance/master/entity/entity.module').then(m => m.EntityModule) },
            { path: 'division', loadChildren: () => import('./views/finance/master/division/division.module').then(m => m.DivisionModule) },
            { path: 'division-info', loadChildren: () => import('./views/finance/master/division-info/division-info.module').then(m => m.DivisionInfoModule) },
            { path: 'office', loadChildren: () => import('./views/finance/master/office/office.module').then(m => m.OfficeModule) },
            { path: 'office-info', loadChildren: () => import('./views/finance/master/office-info/office-info.module').then(m => m.OfficeInfoModule) },
            { path: 'coa', loadChildren: () => import('./views/finance/master/coa-number-range/coa-number-range.module').then(m => m.CoaNumberRangeModule) },
            { path: 'coa-type', loadChildren: () => import('./views/finance/master/coa-type/coa-type.module').then(m => m.CoaTypeModule) },
            { path: 'coa-type-info', loadChildren: () => import('./views/finance/master/coa-type-info/coa-type-info.module').then(m => m.CoaTypeInfoModule) },
            { path: 'exchange-rate-info', loadChildren: () => import('./views/finance/master/exchange-rate-pair/exchange-rate-pair.module').then(m => m.ExchangeRatePairModule) },
            { path: 'exchange-add-info', loadChildren: () => import('./views/finance/master/exchange-rate-info/exchange-rate-info.module').then(m => m.ExchangeRateInfoModule) },
            { path: 'auto-generate', loadChildren: () => import('./views/finance/master/auto-generate-code/auto-generate-code.module').then(m => m.AutoGenerateCodeModule) },
            { path: 'party-mapping', loadChildren: () => import('./views/finance/master/party-mapping/party-mapping.module').then(m => m.PartyMappingModule) },
            { path: 'party-mapping-info', loadChildren: () => import('./views/finance/master/party-mapping-info/party-mapping-info.module').then(m => m.PartyMappingInfoModule) },
            { path: 'ledger-mapping', loadChildren: () => import('./views/finance/master/ledger-mapping/ledger-mapping.module').then(m => m.LedgerMappingModule) },
            { path: 'template', loadChildren: () => import('./views/finance/master/template/template.module').then(m => m.TemplateModule) },
            { path: 'template-info', loadChildren: () => import('./views/finance/master/template-info/template-info.module').then(m => m.TemplateInfoModule) },
            { path: 'credit', loadChildren: () => import('./views/finance/master/credit-approval-setup/credit-approval-setup.module').then(m => m.CreditApprovalSetupModule) },
            { path: 'credit-info', loadChildren: () => import('./views/finance/master/credit-approval-info/credit-approval-info.module').then(m => m.CreditApprovalInfoModule) },
            { path: 'aging', loadChildren: () => import('./views/finance/master/aging/aging.module').then(m => m.AgingModule) },
            { path: 'region', loadChildren: () => import('./views/finance/master/region-configuration/region-configuration.module').then(m => m.RegionConfigurationModule) },
            { path: 'finance/master/mini-master', loadChildren: () => import('./views/finance/master/employee-mini-master/employee-mini-master.module').then(m => m.EmployeeMiniMasterModule) },
            { path: 'credit-Review', loadChildren: () => import('./views/finance/master/credit-revise-revoke/credit-revise-revoke/credit-revise-revoke.module').then(m => m.CreditReviseRevokeModule) },
            { path: 'credit-Review-info', loadChildren: () => import('./views/finance/master/credit-revise-revoke/credit-revise-revoke-info/credit-revise-revoke-infoe.module').then(m => m.CreditReviseRevokeInfoeModule) },

            // transactions model start
            { path: 'transactions/journal', loadChildren: () => import('./views/finance/transactions/journal-voucher/journal-voucher.module').then(m => m.JournalVoucherModule) },
            { path: 'transactions/payment', loadChildren: () => import('./views/finance/transactions/payment-vouchers/payment-vouchers.module').then(m => m.PaymentVouchersModule) },
            { path: 'transactions/receipt', loadChildren: () => import('./views/finance/transactions/receipt-vouchers/receipt-vouchers.module').then(m => m.ReceiptVouchersModule) },
            { path: 'contra', loadChildren: () => import('./views/finance/master/contra-voucher/contra-voucher.module').then(m => m.ContraVoucherModule) },
            { path: 'contra-info', loadChildren: () => import('./views/finance/master/contra-info/contra-info.module').then(m => m.ContraInfoModule) },
            { path: 'transactions/banking', loadChildren: () => import('./views/finance/transactions/banking/banking.module').then(m => m.BankingModule) },
            { path: 'purchase', loadChildren: () => import('./views/finance/transactions/purchase/purchase.module').then(m => m.PurchaseModule) },
            { path: 'purchase-info', loadChildren: () => import('./views/finance/transactions/purchase-info/purchase-info.module').then(m => m.PurchaseInfoModule) },
            { path: 'internal-order', loadChildren: () => import('./views/finance/transactions/internal-order/internal-order.module').then(m => m.InternalOrderModule) },
            { path: 'internal-info', loadChildren: () => import('./views/finance/transactions/internal-info/internal-info.module').then(m => m.InternalInfoModule) },
            { path: 'voucher', loadChildren: () => import('./views/finance/transactions/voucher-reversals/voucher-reversals.module').then(m => m.VoucherReversalsModule) },
            { path: 'voucher-info', loadChildren: () => import('./views/finance/transactions/voucher-reversals-info/voucher-reversals-info.module').then(m => m.VoucherReversalsInfoModule) },
            { path: 'vendor-notes', loadChildren: () => import('./views/finance/transactions/vendor-credit-notes/vendor-credit-notes.module').then(m => m.VendorCreditNotesModule) },
            { path: 'vendor-info-notes', loadChildren: () => import('./views/finance/transactions/vendor-credit-notes-info/vendor-credit-notes-info.module').then(m => m.VendorCreditNotesInfoModule) },
            { path: 'transactions/invoices_AR_view', loadChildren: () => import('./views/finance/transactions/invoices-ar/invoices-ar.module').then(m => m.InvoicesARModule) },
            { path: 'transactions/invoices_AP_view', loadChildren: () => import('./views/finance/transactions/invoices-ap/invoices-ap.module').then(m => m.InvoicesAPModule) },
            { path: 'Adjustment', loadChildren: () => import('./views/finance/transactions/adjustment-voucher/adjustment-voucher.module').then(m => m.AdjustmentVoucherModule) },
            { path: 'Adjustment-info', loadChildren: () => import('./views/finance/transactions/adjustment-voucher-info/adjustment-voucher-info.module').then(m => m.AdjustmentVoucherInfoModule) },
            { path: 'purchase-invoice', loadChildren: () => import('./views/finance/transactions/purchase-invoise-admin/purchase-invoise-admin.module').then(m => m.PurchaseInvoiseAdminModule) },
            { path: 'purchase-admin-info', loadChildren: () => import('./views/finance/transactions/purchase-invoice-admin-info/purchase-invoice-admin-info.module').then(m => m.PurchaseInvoiceAdminInfoModule) },
            { path: 'transactions/transaction-locks', loadChildren: () => import('./views/finance/transactions/transaction-locks/transaction-locks.module').then(m => m.TransactionLocksModule) },
            { path: 'credit-review', loadChildren: () => import('./views/finance/credit/credit-review/credit-review-view/credit-review.module').then(m => m.CreditReviewModule) },
            { path: 'credit-review-info', loadChildren: () => import('./views/finance/credit/credit-review/credit-review-details/credit-review-details.module').then(m => m.CreditReviewDetailsModule) },
            { path: 'transactions/payment-request', loadChildren: () => import('./views/finance/transactions/payment-request/payment-request.module').then(m => m.PaymentRequestModule) },
            { path: 'transactions/credit-application', loadChildren: () => import('./views/finance/transactions/credit-application/credit-application.module').then(m => m.CreditApplicationModule) },
            { path: 'transactions/openingBalances', loadChildren: () => import('./views/finance/transactions/account-receivable/account-receivable.module').then(m => m.AccountReceivableModule) },
            { path: 'transactions/openingBalances', loadChildren: () => import('./views/finance/transactions/account-payable/account-payable.module').then(m => m.AccountPayableModule) },
            { path: 'transactions/openingBalances', loadChildren: () => import('./views/finance/transactions/asset/asset.module').then(m => m.AssetModule) },
            { path: 'transactions/openingBalances', loadChildren: () => import('./views/finance/transactions/expenses/expenses.module').then(m => m.ExpensesModule) },
            { path: 'transactions/openingBalances', loadChildren: () => import('./views/finance/transactions/bank/bank.module').then(m => m.BankModule) },
            { path: 'transactions/openingBalances', loadChildren: () => import('./views/finance/transactions/liability/liability.module').then(m => m.LiabilityModule) },
            { path: 'transactions/openingBalances', loadChildren: () => import('./views/finance/transactions/equity/equity.module').then(m => m.EquityModule) },
            { path: 'transactions/openingBalances', loadChildren: () => import('./views/finance/transactions/income/income.module').then(m => m.IncomeModule) },



        ]
    },

];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
