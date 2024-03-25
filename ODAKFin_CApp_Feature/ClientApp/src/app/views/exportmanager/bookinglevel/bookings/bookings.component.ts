import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { format } from 'util';
import { Title } from '@angular/platform-browser';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { ExportBooking, ExportBkgContainer, ExportBkgHaz, ExportBkgReefer, ExportBkgOutGauge, ExportBkgOceanFrt, ExportBkgShipment } from '../../../../model/exportbooking';

import { ExportbookingService } from '../../../../services/exportbooking.service';
/*import { EncrDecrServiceService } from '../../../../services/encr-decr-service.service';*/

declare let $: any;


@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.component.html',
    styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
    title = 'Booking Level Tasks';
    bkgparty: string = '';
    bkgNo: string = '';
    bkgdate: string = '';
    bkgcommission: string = '';
    enqNo: string = '';
    source: string = '';
    salesPerson: string = '';
    origin: string = '';
    loadPort: string = '';
    dischargePort: string = '';
    destination: string = '';
    routes: string = '';
    deliveryTerms: string = '';
    commodity: string = '';
    grosswt: string = '';
    hscode: string = '';
    paymentterms: string = '';
    vesselname: string = '';
    voyageno: string = '';
    polterminal: string = '';
    tsvessel: string = '';
    tsvoyage: string = '';
    principal: string = '';
    customercontractno: string = '';
    linercontractno: string = '';
    podagent: string = '';
    fpodagent: string = '';
    tsport1: string = '';
    tsport2: string = '';
    ownership: string = '';
    slotoperator: string = '';
    fixed: string = '';
    freedaysorigin: string = '';
    freedaysoriginvalue: string = '';
    freedaysdes: string = '';
    freedaysdesvalue: string = '';
    damagescheme: string = '';
    damageschemevalue: string = '';
    securitydeposit: string = '';
    securitydepositvalue: string = '';
    bolreq: string = '';
    bolreqvalue: string = '';
    officecode: string = '';
    Agent: string = '';
    public DivSalesPerson: boolean = true;
    public DivAgent: boolean = true;
    constructor(private router: Router, private route: ActivatedRoute, private titleService: Title, private ES: EncrDecrServiceService, private bs: ExportbookingService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            this.bookingForm = this.fb.group({
                ID: params['id'],
            });

        });
    }
    bookingForm: FormGroup;
    dataSource: ExportBooking[];
    excntr: ExportBkgContainer[];
    exhaz: ExportBkgHaz[];
    exreefer: ExportBkgReefer[];
    exout: ExportBkgOutGauge[];
    exocean: ExportBkgOceanFrt[];
    exslot: ExportBkgOceanFrt[];
    expol: ExportBkgShipment[];
    expod: ExportBkgShipment[];
    public HazardousHidvalue: boolean = false;
    public RefferHidvalue: boolean = false;
    public OutGaugeHidvalue: boolean = false;
    public OutGaugeHidvaluegrid: boolean = false;
    public RefferHidvaluegrid: boolean = false;
    public HazardousHidvaluegrid: boolean = false;
    VesselID = 0;
    VoyageID = 0;

    getUserIdsFirstWay($event) {
        let userId = (<HTMLInputElement>document.getElementById('userIdFirstWay')).value;
        //this.userList1 = [];

        //if (userId.length > 2) {
        //    if ($event.timeStamp - this.lastkeydown1 > 200) {
        //        this.userList1 = this.searchFromArray(this.userData, userId);
        //    }
        //}
    }

    searchFromArray(arr, regex) {
        let matches = [], i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i].match(regex)) {
                matches.push(arr[i]);
            }
        }
        return matches;
    };
    ngOnInit() {

        var queryString = new Array();
        this.route.queryParams.subscribe(params => {
            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyPara = Parameter.split(',');
            for (var i = 0; i < KeyPara.length; i++) {
                var key = KeyPara[i].split(':')[0];
                var value = KeyPara[i].split(':')[1];
                queryString[key] = value;
            }
            if (queryString["ID"] != null) {
                this.bookingForm.value.ID = queryString["ID"].toString();
            }

        });

        this.titleService.setTitle(this.title);

        this.createForm();

    }
    btntabclick(tab) {

        var values = "ID: " + this.bookingForm.value.ID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1)
            this.router.navigate(['/views/exportmanager/bookinglevel/bookings/bookings'], { queryParams: { encrypted } });
        else if (tab == 2) {
            this.router.navigate(['/views/exportmanager/bookinglevel/containers/containers'], { queryParams: { encrypted } });
        }
        else if (tab == 3) {
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/haz/haz'], { queryParams: { encrypted } });
        }
        else if (tab == 4) {
            this.router.navigate(['/views/exportmanager/bookinglevel/bol/bol'], { queryParams: { encrypted } });
        }
        else if (tab == 5) {
            this.router.navigate(['/views/exportmanager/bookinglevel/blrelease/blrelease'], { queryParams: { encrypted } });
        }
        else if (tab == 6) {
            this.router.navigate(['/views/exportmanager/bookinglevel/exphandling/exphandling'], { queryParams: { encrypted } });
        }
        else if (tab == 7) {
            this.router.navigate(['/views/exportmanager/bookinglevel/invoices/invoices'], { queryParams: { encrypted } });
        }
        else if (tab == 8) {
            this.router.navigate(['/views/exportmanager/bookinglevel/attach/attach'], { queryParams: { encrypted } });
        }
        else if (tab == 9) {
            this.router.navigate(['/views/exportmanager/bookinglevel/blallotment/blallotment'], { queryParams: { encrypted } });
        }
    }

    //btntabclick(tab) {

    //    var BkgId=this.bookingForm.value.ID;

    //     if (tab == 1)
    //         this.router.navigate(['/views/exportmanager/bookinglevel/bookings/bookings'], { queryParams: { BkgId } });
    //    else if (tab == 2) {
    //         this.router.navigate(['/views/exportmanager/bookinglevel/containers/containers'], { queryParams: { BkgId } });
    //    }
    //    else if (tab == 3) {
    //         this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/haz/haz'], { queryParams: { BkgId } });
    //    }
    //    else if (tab == 4) {
    //         this.router.navigate(['/views/exportmanager/bookinglevel/bol/bol'], { queryParams: { BkgId } });
    //    }
    //    else if (tab == 5) {
    //         this.router.navigate(['/views/exportmanager/bookinglevel/blrelease/blrelease'], { queryParams: { BkgId } });
    //    }
    //    else if (tab == 6) {
    //         this.router.navigate(['/views/exportmanager/bookinglevel/exphandling/exphandling'], { queryParams: { BkgId } });
    //    }
    //    else if (tab == 7) {
    //         this.router.navigate(['/views/exportmanager/bookinglevel/invoices/invoices'], { queryParams: { BkgId } });
    //    }
    //    else if (tab == 8) {
    //         this.router.navigate(['/views/exportmanager/bookinglevel/attach/attach'], { queryParams: { BkgId } });
    //    }
    //}




    createForm() {
        if (this.bookingForm.value.ID != null) {
            this.bs.getExBookingValues(this.bookingForm.value).subscribe(data => {
                this.bookingForm.patchValue(data[0]);
                this.bkgparty = data[0].BookingParty;
                this.bkgNo = data[0].BookingNo;
                this.bkgdate = data[0].BookingDate;
                this.bkgcommission = data[0].BookingCommission;
                this.enqNo = data[0].EnquiryNo;
                this.source = data[0].Source;
                if (data[0].Source.toString() == "Local") {
                   
                    this.DivSalesPerson = true;
                    this.DivAgent = false;
                }
                if (data[0].Source.toString() == "Nomination") {
                    
                    this.DivSalesPerson = false;
                    this.DivAgent = true;
                }
                this.salesPerson = data[0].SalesPerson;
                this.Agent = data[0].Agent;
                this.origin = data[0].Origin;
                this.loadPort = data[0].LoadPort;
                this.dischargePort = data[0].DischargePort;
                this.destination = data[0].Destination;
                this.routes = data[0].Route;
                this.deliveryTerms = data[0].DeliveryTerms;
                this.commodity = data[0].Commodity;
                this.grosswt = data[0].CargoWeight;
                this.hscode = data[0].HsCode;
                this.paymentterms = data[0].PaymentTerms;
                this.vesselname = data[0].VesselName;
                this.voyageno = data[0].VoyageNo;
                this.polterminal = data[0].POLTerminal;
                this.tsvessel = data[0].TsVesselName;
                this.tsvoyage = data[0].TsVoyageNo;
                this.principal = data[0].Principal;
                this.customercontractno = data[0].CusContractNo;
                this.linercontractno = data[0].LinerContractNo;
                this.podagent = data[0].PODAgent;
                this.fpodagent = data[0].FPODAgent;
                this.tsport1 = data[0].TSPortAgent1;
                this.tsport2 = data[0].TSPortAgent2;
                this.ownership = data[0].Ownership;
                this.slotoperator = data[0].SlotOperator;
                this.fixed = data[0].Fixed;
              
                this.bolreqvalue = data[0].BolReqValue;
                this.officecode = data[0].OfficeCode;
              

                if (data[0].HazarOpt.toString() == "2") {
                    this.HazardousHidvalue = true;
                    this.HazardousHidvaluegrid = true;
                }
                if (data[0].ReeferOpt.toString() == "2") {
                    this.RefferHidvalue = true;
                    this.RefferHidvaluegrid = true;
                }
                if (data[0].OOGOpt.toString() == "2") {
                    this.OutGaugeHidvalue = true;
                    this.OutGaugeHidvaluegrid = true;
                }


            });

            this.bs.getExBookingContrValues(this.bookingForm.value).subscribe(data => {
                this.excntr = data;
            });
            this.bs.getExBookingHazValues(this.bookingForm.value).subscribe(data => {
                this.exhaz = data;
            });
            this.bs.getExBookingReeferValues(this.bookingForm.value).subscribe(data => {
                this.exreefer = data;
            });
            this.bs.getExBookingOutGaugeValues(this.bookingForm.value).subscribe(data => {
                this.exout = data;
            });
            this.bs.getExBookingOceanFrtValues(this.bookingForm.value).subscribe(data => {
                this.exocean = data;
            });
            this.bs.getExBookingSlotFrtValues(this.bookingForm.value).subscribe(data => {
                this.exslot = data;
            });
            this.bs.getExBookingPOLValues(this.bookingForm.value).subscribe(data => {
                this.expol = data;
            });
            this.bs.getExBookingPODValues(this.bookingForm.value).subscribe(data => {
                this.expod = data;
            });

            this.bookingForm = this.fb.group({

                ID: 0,
                BookingNo: '',
                BookingParty: '',
                BookingStatus: '',
                BookingDate: '',
                BookingCommission: '',
                EnquiryNo: '',
                Source: '',
                SalesPerson: '',
                Agent:'',
                Origin: '',
                DischargePort: '',
                LoadPort: '',
                Destination: '',
                Route: '',
                DeliveryTerms: '',
                Commodity: '',
                CargoWeight: '',
                HsCode: '',
                HazarOpt: 0,
                ReeferOpt: 0,
                OOGOpt: 0,
                PaymentTerms: '',
                FreeDayOrigin: 0,
                FreeDaysOrignValue: '',
                FreeDaysDesValue: '',
                DamageSchemeValue: '',
                SecurityDepositValue: '',
                BolReqValue: '',
                FreeDayDestination: 0,
                DamageScheme: 0,
                SecurityDeposit: 0,
                BOLRequirement: 0,

            })
        }
        else {
            this.bookingForm = this.fb.group({

                ID: 0,
                BookingNo: '',
                BookingParty: '',
                BookingStatus: '',
                BookingDate: '',
                BookingCommission: '',
                EnquiryNo: '',
                Source: '',
                SalesPerson: '',
                Agent: '',
                Origin: '',
                DischargePort: '',
                LoadPort: '',
                Destination: '',
                Route: '',
                DeliveryTerms: '',
                Commodity: '',
                CargoWeight: '',
                HsCode: '',
                HazarOpt: 1,
                ReeferOpt: 1,
                OOGOpt: 1,
                PaymentTerms: '',
                FreeDayOrigin: 1,
                FreeDaysOrignValue: '',
                FreeDaysDesValue: '',
                DamageSchemeValue: '',
                SecurityDepositValue: '',
                BolReqValue: '',
                FreeDayDestination: 1,
                DamageScheme: 1,
                SecurityDeposit: 1,
                BOLRequirement: 1,

            })
        }
    }

    OnclickHazaropt(value) {

        if (value == 2) {
            this.HazardousHidvalue = true;
            this.HazardousHidvaluegrid = true;
        }
        else {
            this.HazardousHidvalue = false;
            this.HazardousHidvaluegrid = false;
        }
    }

    OnclickReeferOpt(value) {

        if (value == 2) {
            this.RefferHidvalue = true;
            this.RefferHidvaluegrid = true;
        }
        else {
            this.RefferHidvalue = false;
            this.RefferHidvaluegrid = false;
        }
    }
    OnclickOOGOpt(value) {

        if (value == 2) {
            this.OutGaugeHidvalue = true;
            this.OutGaugeHidvaluegrid = true;
        }
        else {
            this.OutGaugeHidvalue = false;
            this.OutGaugeHidvaluegrid = false;
        }
    }


    //btnBackOnclick() {

    //    var values = "ID: " + this.VesselID + "&VoyageID:" + this.VoyageID;
    //    var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
    //    this.router.navigate(['/views/exportmanager/bookinglevel/bookinglevelview/bookinglevelview/'], { queryParams: { encrypted } });
    //}
}
