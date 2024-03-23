import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { User } from 'oidc-client';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Key } from 'protractor';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { GeneralMaster, drodownVeslVoyage, CurrencyMaster, ChargeTBMaster } from 'src/app/model/common';
import {
    myCntrTypesDynamicGrid, MyCargoMaster, myHazardousDynamicGrid, myDynamicOutGaugeCargoGrid, myDynamicReeferGrid, DynamicGridAttach,
    myDynamicShimpmentPOLGrid, myDynamicShimpmentPODGrid, mydropdownPort, myenquiryFreightDynamicgrid, myenquiryRevenuDynamicgrid, myFreightBrackupDynamicgrid, MyLinerDropdown, MyCustomerContractDropdown
} from 'src/app/model/enquiry';
import { CommonValues, MyCustomerDropdown, MyCntrTypeDropdown, MyPortdrodown, MyTerminaldrodown, MyGeneraldropdown, MyAgencyDropdown } from 'src/app/model/Admin';
import { SSL_OP_LEGACY_SERVER_CONNECT } from 'constants';
import { CommonValue } from '../../../model/RateApproval';
import { LogdetailsService } from '../../../services/logdetails.service';
declare let $: any;

@Component({
    selector: 'app-enquiries',
    templateUrl: './enquiries.component.html',
    styleUrls: ['./enquiries.component.css']
})
export class EnquiriesComponent implements OnInit {
    CreatedOn: string = '';
    CreatedBy: string = '';
    ModifiedOn: string = '';
    ModifiedBy: string = '';

    CopyID = 0;
    Formvalues: FormGroup;
    errorMsg: string;
    CustomerMasterAllvalues: MyCustomerDropdown[];
    SalesMasterAllvalues: MyCustomerDropdown[];
    AgencyMasterAllvalues: MyAgencyDropdown[];
    OfficeMasterAllvalues: MyCustomerDropdown[];

    AllListEnquirySource: CommonValues[];
    AllListBookingCommission: CommonValues[];
    AllListEnquireStatus: CommonValues[];
    AllListPaymentTerms: CommonValues[];
    AllListUMOTerms: CommonValues[];
    ChargeCodeAllvalues: ChargeTBMaster[];
    PortAllvalues: MyPortdrodown[];
    RouteTypes = "49";
    FillRouteTypes: GeneralMaster[];
    ddlCancelItem: GeneralMaster[];
    ddlRejectItem: GeneralMaster[];
    StdSplvalues: CommonValues[];
    StdSplvaluesNew: CommonValues[];
    DeliveryTerms = "75";
    CommodityTerms = "2";
    FillDeliveryTerms: GeneralMaster[];
    FillCommodity: GeneralMaster[];
    fillVeslVoyage: drodownVeslVoyage[];
    fillCntrType: MyCntrTypeDropdown[];
    fillLoadPortTerminal: MyTerminaldrodown[];
    fillCargo: MyCargoMaster[];
    fillPricibleMasterAllvalues: MyCustomerDropdown[];
    fileLinerMaster: MyLinerDropdown[];
    fileCustomerContactMaster: MyCustomerContractDropdown[];
    FillPriciblePortMaster: mydropdownPort[];
    CurrencyValue: CurrencyMaster[];
    FillVoyageMaster: drodownVeslVoyage[];


    newDynamicCntrNoGrid: any = {};
    DynamicCntrNoGrid: Array<myCntrTypesDynamicGrid> = [];

    newDynamicHazardousGrid: any = {};
    DynamicHazardousGrid: Array<myHazardousDynamicGrid> = [];

    newDynamicOutGaugeCargoGrid: any = {};
    DynamicOutGaugeCargoGrid: Array<myDynamicOutGaugeCargoGrid> = [];
    newDynamicReeferGrid: any = {};
    DynamicReeferGrid: Array<myDynamicReeferGrid> = [];
    newDynamicShimpmentPOLGrid: any = {};
    DynamicShimpmentPOLGrid: Array<myDynamicShimpmentPOLGrid> = [];

    newDynamicShimpmentPODGrid: any = [];
    DynamicShimpmentPODGrid: Array<myDynamicShimpmentPODGrid> = [];
    newfillFreightDynamicgrid: any = [];
    fillFreightDynamicgrid: Array<myenquiryFreightDynamicgrid> = [];
    newfillSlotDynamicgrid: any = [];
    fillSlotDynamicgrid: Array<myenquiryFreightDynamicgrid> = [];

    newfillRevenuDynamicgrid: any = [];
    fillRevenuDynamicgrid: Array<myenquiryRevenuDynamicgrid> = [];
    DynamicGridAttachLink: Array<DynamicGridAttach> = [];
    newfillFreightBrackup: any = [];
    fillFreightBrackup: Array<myFreightBrackupDynamicgrid> = [];
    newfillManifestBrackup: any = [];
    fillManifestBrackup: Array<myFreightBrackupDynamicgrid> = [];

    newfillSlotFreightBrackup: any = [];
    fillSlotFreightBrackup: Array<myFreightBrackupDynamicgrid> = [];

    newfillSlotManifestBrackup: any = [];
    fillSlotManifestBrackup: Array<myFreightBrackupDynamicgrid> = [];

    ValidStatusID = 0;
    AID = null;
    // errorMsg: string;
    RegId = 0;
    val: any = {};
    public showSalesPerson: boolean = true;
    public showAgent: boolean = false;
    public HazardousHidvalue: boolean = false;
    public RefferHidvalue: boolean = false;
    public OutGaugeHidvalue: boolean = false;
    public OutGaugeHidvaluegrid: boolean = false;
    public RefferHidvaluegrid: boolean = false;
    public HazardousHidvaluegrid: boolean = false;

    public ControlHazardous: boolean = false;
    public ControlDisplay: boolean = false;
    public ControlDisplayGrid: boolean = false;

    public ControlDisplayRadio: boolean = true;
    public showReason: boolean = false;


    public showSave: boolean = true;
    public showEdit: boolean = false;
    public showApprove: boolean = false;
    public showReject: boolean = false;
    public showCancel: boolean = false;
    public showRemarks: boolean = false;
    public GridShowing: boolean = false;
    public disableSave: boolean = true;
    public disableApprove: boolean = false;
    public disableReject: boolean = false;
    public disableCancel: boolean = false;
    public disapleFreightCommision: boolean = true;


    HazarOpt: number = 1;
    month = 0;
    HDArrayIndex = '';
    allExpandState = false;
    Reason = "";
    Remarks = "";
    constructor(private router: Router, private route: ActivatedRoute, private service: EnquiryService, private fb: FormBuilder, private ES: EncrDecrServiceService, private LS: LogdetailsService) { }

    ngOnInit() {

        this.newDynamicCntrNoGrid = { ID: 0, CntrTypeID: 0, CntrTypes: "", Nos: 0 };
        this.DynamicCntrNoGrid.push(this.newDynamicCntrNoGrid);

        this.newDynamicHazardousGrid = { ID: 0, HazarMCONo: "", HazarClass: "", CommodityID: 0 };
        this.DynamicHazardousGrid.push(this.newDynamicHazardousGrid);

        this.newDynamicOutGaugeCargoGrid = { ID: 0, CommodityID: "", Length: 0, Width: 0, Height: 0 };
        this.DynamicOutGaugeCargoGrid.push(this.newDynamicOutGaugeCargoGrid);

        this.newDynamicReeferGrid = { ID: 0, CommodityID: "", Humidity: 0, Ventilation: 0, Temperature: 0 };
        this.DynamicReeferGrid.push(this.newDynamicReeferGrid);


        //this.newDynamicShimpmentPOLGrid = { ID: 0, CntrTypeID: 0, ChargeOPT: 1, Amount2: 0, Remarks: "", CurrencyID: 146 };
        //this.DynamicShimpmentPOLGrid.push(this.newDynamicShimpmentPOLGrid);


        //this.newDynamicShimpmentPODGrid = { ID: 0, CntrTypeID: 0, ChargeOPT: 1, Amount2: 0, Remarks: "", CurrencyID: 146 };
        //this.DynamicShimpmentPODGrid.push(this.newDynamicShimpmentPODGrid);


        //this.newfillFreightDynamicgrid = { ID: 0, CntrTypeID: 0, CommodityID: 3, CurrencyID: 146, Nos: 0, PerAmount: 0, ManifestPerAmount: 0, CommPerAmount: 0, CommPerTotal: 0 };
        //this.fillFreightDynamicgrid.push(this.newfillFreightDynamicgrid);

        // this.newfillSlotDynamicgrid = { ID: 0, CntrTypeID: 0, CommodityID: 3, CurrencyID: 146, Nos: 0, PerAmount: 0, ManifestPerAmount: 0, ManifestTotalAmount: 0, TotalAmount: 0 };
        //this.fillSlotDynamicgrid.push(this.newfillSlotDynamicgrid);

        this.newfillRevenuDynamicgrid = { ID: 0, CntrTypeID: 0, Nos: 0, CommodityID: 0, ChargeCodeID: 0, Amount: 0, BasicID: 0, TotalAmount: 0, CurrencyID: 146, ExRate: 0, PaymentTermID: 0, CostAmount: 0, TotalCostAmount: 0 };
        this.fillRevenuDynamicgrid.push(this.newfillRevenuDynamicgrid);


        this.newfillFreightBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: "", Amount: 0 };
        this.fillFreightBrackup.push(this.newfillFreightBrackup);


        this.newfillManifestBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: "", Amount: 0 };
        this.fillManifestBrackup.push(this.newfillManifestBrackup);

        this.newfillSlotFreightBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: "", Amount: 0 };
        this.fillSlotFreightBrackup.push(this.newfillSlotFreightBrackup);


        this.newfillSlotManifestBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: "", Amount: 0 };
        this.fillSlotManifestBrackup.push(this.newfillSlotManifestBrackup);

        this.createform();

        this.InitBind();
        var queryString = new Array();
        var queryStringCopy = new Array();


        this.route.queryParams.subscribe(params => {
            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyParavalue = Parameter.split('&');
            var KeyPara1 = "";
            var KeyPara = "";
            for (var i = 0; i < KeyParavalue.length; i++) {
                if (i == 0)
                    var KeyPara = KeyParavalue[0].split(',');
                if (i == 1)
                    var KeyPara1 = KeyParavalue[1].split(',');
            }


            for (var i = 0; i < KeyPara.length; i++) {
                var key = KeyPara[i].split(':')[0];
                var value = KeyPara[i].split(':')[1];
                queryString[key] = value;

            }

            for (var i = 0; i < KeyPara1.length; i++) {
                var key = KeyPara1[i].split(':')[0];
                var value = KeyPara1[i].split(':')[1];
                queryStringCopy[key] = value;

            }

            if (queryString["ID"] != null) {
                this.Formvalues = this.fb.group({
                    ID: queryString["ID"].toString(),

                });
                this.CopyID = queryStringCopy["CopyID"];
                if (this.CopyID != 1) {
                    this.ForsControlEnable();
                }
                this.ExistingEnquiryBind();

                this.createExistingform();
            }
        });

        this.showSave = true;
        this.disableSave = false;

        $('#LoadPortID').on('select2:select', (e, args) => {
            this.OnClickPOLPortTerminal($("#LoadPortID").val());
        });

        //$('#PrincibalID').on('select2:select', (e, args) => {
        //    //this.OnClickAgencyTerminal($("#PrincibalID").val());
        //});



        $('#CargoID').on('select2:select', (e, args) => {
            // this.BindCommodityHSCode($("#CargoID").val());
            //this.OnClickAgencyTerminal($("#PrincibalID").val());
        });
        $('#VesselID').on('select2:select', (e, args) => {
            this.OnClickVoyageID($("#VesselID").val());
        });

        $('#RouteID').on('select2:select', (e, args) => {

            if ($('#RouteID').val() == "183")
                $('#TranshipmentPortID').select2("enable", false);
            else
                $("#TranshipmentPortID").removeAttr('disabled');
        });

        $('#BookingCommissionID').on('select2:select', (e, args) => {

            if ($('#BookingCommissionID').val() == "1")
                this.disapleFreightCommision = false;
            else
                this.disapleFreightCommision = true;
        });



        $('#EnquirySourceID').on('select2:select', (e, args) => {
            $('.my-select').select2();
            if ($('#EnquirySourceID').val() == "1") {
                $("#NominationID").prop("disabled", "disabled");
                $('#SalesPersonID').removeAttr('disabled');


            }
            else {

                $("#SalesPersonID").prop("disabled", "disabled");
                $('#NominationID').removeAttr('disabled');
            }

        });




    }

    createform() {

        this.Formvalues = this.fb.group({
            ID: 0,
            RegID: 0,
            PortID: 0,
            CustomerID: 0,
            BkgPartyChk: 0,
            ShiperCheckBox: 0,
            ShipperID: 0,
            EnquiryNo: '',
            EnquiryDate: 0,
            EnquirySourceID: 0,
            EnquiryStatusID: 0,
            BookingCommissionID: 0,
            ValidTillDate: '',
            SalesPersonID: 0,
            NominationID: 0,
            OriginID: 0,
            LoadPortID: 0,
            DischargePortID: 0,
            DestinationID: 0,
            RouteID: 0,
            DeliveryTermsID: 0,
            VesselID: 0,
            VoyagID: 0,
            POLTerminalID: 0,
            TranshipmentPortID: 0,
            TxtTSVessel: '',
            TxtTSVoyage: '',
            CargoID: 0,
            CargoWeight: '',
            HSCode: '',
            PrincibalID: 0,
            RateApproval: '',
            CustomerContract: '',
            AttachedRateApprovals: '',
            PODAgentID: 0,
            FPODAgentID: 0,
            TsPort1AgentID: 0,
            TsPort2AgentID: 0,
            PaymentTerms: 0,
            ChargeHead: 0,
            ItemsHarz: '',
            HazarOpt: 1,
            ReeferOpt: 1,
            OOGOpt: 1,
            FreeDayOrigin: 1,
            NumberOfDays: '',
            FreeDestination: 1,
            NumberOfDaysDestin: '',
            FreeDayDestination: 1,
            DamageScheme: 1,
            SecurityDeposit: 1,
            BOLRequirement: 1,
            txtDamageScheme: '',
            txtSecurityDeposit: '',
            txtBOLRequirement: '',
            SessionFinYear: '',
            AgentCode: '',
            PayTermsID: 0,
            ItemFreightBrackup: '',
            Type: 0,
            CommodityID: 0,
            CustomerContractID: 0,
            LineContractID: 0,
            OfficeCode: 0,
            CancelReasonID: 0,
            CancelReason: '',
            RejectReasonID: 0,
            RejectReason: '',
            Commodity: ''
        });
        this.StandardOrgChange(1);
        this.StandardDestination(1);
        this.StandardDamageSchema(1);
        this.StandardSecurityDeposit(1);
        this.StandardBOLRequirment(1);

    }

    createExistingform() {

        this.Formvalues = this.fb.group({
            ID: 0,
            RegID: 0,
            PortID: 0,
            CustomerID: 0,
            BkgPartyChk: 0,
            ShiperCheckBox: 0,
            ShipperID: 0,
            EnquiryNo: '',
            EnquiryDate: 0,
            EnquirySourceID: 0,

            EnquiryStatusID: 0,
            BookingCommissionID: 0,
            ValidTillDate: '',
            SalesPersonID: 0,
            NominationID: 0,
            OriginID: 0,
            LoadPortID: 0,
            DischargePortID: 0,
            DestinationID: 0,
            RouteID: 0,
            DeliveryTermsID: 0,
            VesselID: 0,
            VoyagID: 0,
            POLTerminalID: 0,
            TranshipmentPortID: 0,
            TxtTSVessel: '',
            TxtTSVoyage: '',
            CargoID: 0,
            CargoWeight: '',
            HSCode: '',
            PrincibalID: 0,
            RateApproval: '',
            CustomerContract: '',
            AttachedRateApprovals: '',
            PODAgentID: 0,
            FPODAgentID: 0,
            TsPort1AgentID: 0,
            TsPort2AgentID: 0,
            PaymentTerms: 0,
            ChargeHead: 0,
            ItemsHarz: '',
            HazarOpt: 1,
            ReeferOpt: 1,
            OOGOpt: 1,
            FreeDayOrigin: 1,
            NumberOfDays: '',
            FreeDestination: 1,
            NumberOfDaysDestin: '',
            FreeDayDestination: 1,
            DamageScheme: 1,
            SecurityDeposit: 1,
            BOLRequirement: 1,
            txtDamageScheme: '',
            txtSecurityDeposit: '',
            txtBOLRequirement: '',
            SessionFinYear: '',
            AgentCode: '',
            PayTermsID: 0,
            CustomerContractID: 0,
            LineContractID: 0,
            OfficeCode: 0,
            CancelReasonID: 0,
            CancelReason: '',
            RejectReasonID: 0,
            RejectReason: '',
            Commodity: '',
            PageName: '',
            SeqNo: 0,
            LogInID: 0,
            UserID: '',


        });

    }

    InitBind() {

        this.InitDropdown();
        var dtToday = new Date();
        let month = dtToday.getMonth() + 1;
        let day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10)
            month = 0 + month;
        if (day < 10)
            day = 0 + day;

        var minDate = year + '-' + month + '-' + day;


        this.Formvalues.get('ValidTillDate').patchValue(this.formatDate(new Date().toISOString().slice(0, 10)));
        this.Formvalues.get('EnquiryDate').patchValue(this.formatDate(new Date().toISOString().slice(0, 10)));
        this.Formvalues.get('ValidTillDate').patchValue(this.formatDate(minDate));
        this.Formvalues.get('EnquiryStatusID').patchValue(1);
        this.Formvalues.get('BookingCommissionID').patchValue(2);
        $("#EnquiryStatusID").select2().val("1").trigger("change");
        $("#BookingCommissionID").select2().val("2").trigger("change");

        $("#NominationID").prop("disabled", "disabled");
        $('#SalesPersonID').removeAttr('disabled');

    }

    InitDropdown() {

        $('.my-select').select2();
        $(document).on('select2:open', (e) => {
            const selectId = e.target.id

            $(".select2-search__field[aria-controls='select2-" + selectId + "-results']").each(function (
                key,
                value,
            ) {
                value.focus();
            })
        })

        this.StdSplvalues = [
            { ID: '1', Desc: 'STANDARD' },
            { ID: '2', Desc: 'SPECIAL' },
        ];

        this.StdSplvaluesNew = [
            { ID: '1', Desc: 'STANDARD' },
            { ID: '2', Desc: 'SPECIAL' },
        ];


        this.AllListEnquirySource = [
            { ID: "0", Desc: '--select--' },
            { ID: "1", Desc: 'Local' },
            { ID: "2", Desc: 'Nomination' },
        ];

        this.AllListBookingCommission = [
            { ID: "0", Desc: '--select--' },
            { ID: "1", Desc: 'Yes' },
            { ID: "2", Desc: 'No' },
        ]
        this.AllListEnquireStatus = [

            { ID: "1", Desc: 'Open' },
            { ID: "2", Desc: 'Confirmed' },
            { ID: "3", Desc: 'Lost' },
            { ID: "4", Desc: 'Cancelled' },
        ];

        this.AllListPaymentTerms = [
            { ID: "0", Desc: '--select--' },
            { ID: "1", Desc: 'Prepaid' },
            { ID: "2", Desc: 'Collect' },
        ];

        this.AllListUMOTerms = [
            { ID: "0", Desc: '--select--' },
            { ID: "1", Desc: 'CNTR' },
            { ID: "2", Desc: 'BL' },
        ];


        this.service.getCustomerList().subscribe(data => {
            this.CustomerMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });



        this.service.getUserMasterList().subscribe(data => {
            this.SalesMasterAllvalues = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.getAgencyMasterList().subscribe(data => {
            this.AgencyMasterAllvalues = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });




        this.service.getPortList().subscribe(data => {
            this.PortAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getGeneralList(this.RouteTypes).subscribe(data => {
            this.FillRouteTypes = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        this.service.getGeneralList(this.DeliveryTerms).subscribe(data => {
            this.FillDeliveryTerms = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getVslVoyList().subscribe(data => {
            this.fillVeslVoyage = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getCntrTypesList().subscribe(data => {
            this.fillCntrType = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getCargoMasterList().subscribe(data => {
            this.fillCargo = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getPrincibleList().subscribe(data => {
            this.fillPricibleMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getCurrencyList().subscribe(data => {
            this.CurrencyValue = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.getChargeCodeList().subscribe(data => {
            this.ChargeCodeAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.getGeneralList(this.CommodityTerms).subscribe(data => {
            this.FillCommodity = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.getLinerContractList().subscribe(data => {
            this.fileLinerMaster = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getCustomerContractList().subscribe(data => {
            this.fileCustomerContactMaster = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.getGeneralList(79).subscribe(data => {
            this.ddlCancelItem = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        this.service.getGeneralList(78).subscribe(data => {
            this.ddlRejectItem = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });





    }
    ExistingEnquiryBind() {


        this.Formvalues.value.LogInID = this.Formvalues.value.ID;
        this.Formvalues.value.SeqNo = 1;
        this.Formvalues.value.PageName = "BookingEnquiries";
        this.LS.getLogDetails(this.Formvalues.value).subscribe(data => {

            if (data.length > 0) {
                this.CreatedOn = data[0].Date;
                this.CreatedBy = data[0].UserName;
            }
            else {
                this.CreatedOn = "NA";
                this.CreatedBy = "NA";
            }

        });

        this.Formvalues.value.LogInID = this.Formvalues.value.ID;
        this.Formvalues.value.SeqNo = 2;
        this.Formvalues.value.PageName = "BookingEnquiries";
        this.LS.getLogDetails(this.Formvalues.value).subscribe(data => {

            this.ModifiedOn = data[0].Date;
            this.ModifiedBy = data[0].UserName;
        });


        this.service.bindExstingEnquiryList(this.Formvalues.value).subscribe((data) => {


            this.Formvalues.patchValue(data[0]);

            if (this.CopyID == 1) {
                this.Formvalues.get('ID').patchValue(0);
                this.Formvalues.get('EnquiryNo').patchValue('');
                this.Formvalues.get('ValidTillDate').patchValue(this.formatDate(new Date().toISOString().slice(0, 10)));
                this.Formvalues.get('EnquiryDate').patchValue(this.formatDate(new Date().toISOString().slice(0, 10)));
                this.Formvalues.get('EnquiryStatusID').patchValue(1);
                $("#EnquiryStatusID").select2().val("1").trigger("change");
                this.ControlDisplayGrid = true;
            }
            else {
                $('#EnquiryStatusID').select2().val(data[0].EnquiryStatusID);
            }
            this.OnClickVoyageID(data[0].VesselID);
            $('#CustomerID').select2().val(data[0].CustomerID);
            $('#EnquirySourceID').select2().val(data[0].EnquirySourceID);

            $('#BookingCommissionID').select2().val(data[0].BookingCommissionID);


            if (data[0].EnquirySourceID == 1) {
                $("#NominationID").prop("disabled", "disabled");
                $('#SalesPersonID').removeAttr('disabled');

            }
            else {
                $("#SalesPersonID").prop("disabled", "disabled");
                $('#NominationID').removeAttr('disabled');

            }

            if (data[0].EnquirySourceID == 1)
                $('#SalesPersonID').select2().val(data[0].SalesPersonID);
            else
                $('#NominationID').select2().val(data[0].NominationID);

            $('#OriginID').select2().val(data[0].OriginID);
            $('#LoadPortID').select2().val(data[0].LoadPortID);
            $('#DischargePortID').select2().val(data[0].DischargePortID);
            $('#DestinationID').select2().val(data[0].DestinationID);

            $('#RouteID').select2().val(data[0].RouteID);
            $('#DeliveryTermsID').select2().val(data[0].DeliveryTermsID);
            $('#CargoID').select2().val(data[0].CargoID);
            $('#VesselID').select2().val(data[0].VesselID);
            $('#VoyagID').select2().val(data[0].VoyagID);
            $('#POLTerminalID').select2().val(data[0].POLTerminalID);
            $('#TranshipmentPortID').select2().val(data[0].TranshipmentPortID);
            $('#PayTermsID').select2().val(data[0].PayTermsID);

            $('#PrincibalID').select2().val(data[0].PrincibalID);
            $('#CustomerContract').select2().val(data[0].CustomerContractID);
            $('#LineContract').select2().val(data[0].LineContractID);
            $('#OfficeCode').select2().val(data[0].OfficeCode);
            this.ValidStatusID = data[0].ValidStatusID;

            this.Remarks = data[0].Remarks;
            this.Reason = data[0].Reason;
            this.StandardOrgChange(data[0].FreeDayOrigin);
            this.StandardDestination(data[0].FreeDayDestination);
            this.StandardDamageSchema(data[0].DamageScheme);
            this.StandardSecurityDeposit(data[0].SecurityDeposit);
            this.StandardBOLRequirment(data[0].BOLRequirement);
            this.OnclickHazaropt(data[0].HazarOpt);
            this.OnclickReeferOpt(data[0].ReeferOpt);
            this.OnclickOOGOpt(data[0].OOGOpt);
            this.showEdit = true;
            if (this.CopyID != 1) {
                if ($("#EnquiryStatusID").val() == 1) {
                    this.showSave = true;
                    this.showApprove = true;
                    this.showReject = true;
                    this.showCancel = true;
                    this.GridShowing = true;
                    this.disableSave = true;
                    this.disableApprove = true;
                    this.disableReject = true;
                    this.disableCancel = true;
                    this.ForsControlEnable();
                    

                }
                if ($("#EnquiryStatusID").val() == 2) {
                    this.disableSave = true;
                    this.disableApprove = true;
                    this.disableReject = true;
                    this.disableCancel = true;
                    this.showReason = false;
                }
                if ($("#EnquiryStatusID").val() == 3) {
                    this.disableSave = true;
                    this.disableApprove = true;
                    this.disableReject = true;
                    this.disableCancel = true;
                    this.showReason = true;
                }
                if ($("#EnquiryStatusID").val() == 4) {
                    this.disableSave = true;
                    this.disableApprove = true;
                    this.disableReject = true;
                    this.disableCancel = true;
                    this.showReason = true;
                }
                //else {
                //    this.showReason = true;
                //    this.showSave = false;
                //    this.showApprove = false;
                //    this.showReject = false;
                //    this.showCancel = false;
                    
                //}
            }
            //else {
            //    this.showSave = true;
               

            //}




        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.bindExstingEnquiryCntrTypeList(this.Formvalues.value).subscribe((data) => {
            this.DynamicCntrNoGrid.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.DynamicCntrNoGrid.push({
                        'ID': item.ID,
                        'CntrTypeID': item.CntrTypeID,
                        'Nos': item.Nos,
                        'CntrTypes': item.CntrTypes
                    })
                }
            }
            else {
                this.newDynamicCntrNoGrid = { ID: 0, CntrTypeID: 0, CntrTypes: "", Nos: 0 };
                this.DynamicCntrNoGrid.push(this.newDynamicCntrNoGrid);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.bindExstingEnquiryHazardousList(this.Formvalues.value).subscribe((data) => {
            this.DynamicHazardousGrid.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.DynamicHazardousGrid.push({
                        'ID': item.ID,
                        'HazarMCONo': item.HazarMCONo,
                        'HazarClass': item.HazarClass,
                        'CommodityID': item.CommodityID
                    })
                }
            }
            else {
                this.newDynamicHazardousGrid = { ID: 0, HazarMCONo: "", HazarClass: "", CommodityID: 0 };
                this.DynamicHazardousGrid.push(this.newDynamicHazardousGrid);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.bindExstingEnquiryOutGaugeCargoList(this.Formvalues.value).subscribe((data) => {
            this.DynamicOutGaugeCargoGrid.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.DynamicOutGaugeCargoGrid.push({
                        'ID': item.ID,
                        'CommodityID': item.CommodityID,
                        'Length': item.Length,
                        'Width': item.Width,
                        'Height': item.Height,
                    })
                }
            }
            else {
                this.newDynamicOutGaugeCargoGrid = { ID: 0, CommodityID: 0, Length: 0, Width: 0, Height: 0 };
                this.DynamicOutGaugeCargoGrid.push(this.newDynamicOutGaugeCargoGrid);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.bindExstingEnquiryRefferList(this.Formvalues.value).subscribe((data) => {
            this.DynamicReeferGrid.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.DynamicReeferGrid.push({
                        'ID': item.ID,
                        'CommodityID': item.CommodityID,
                        'Humidity': item.Humidity,
                        'Ventilation': item.Ventilation,
                        'Temperature': item.Temperature,
                    })
                }
            }
            else {
                this.newDynamicReeferGrid = { ID: 0, CommodityID: 0, Humidity: 0, Ventilation: 0, Temperature: 0 };
                this.DynamicReeferGrid.push(this.newDynamicReeferGrid);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.bindExstingEnquiryShipmentPOLList(this.Formvalues.value).subscribe((data) => {
            this.DynamicShimpmentPOLGrid.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.DynamicShimpmentPOLGrid.push({
                        'ID': item.ID,
                        'CntrTypeID': item.CntrTypeID,
                        'ChargeOPT': item.ChargeOPT,
                        'CurrencyID': item.CurrencyID,

                        'Amount2': item.Amount2,
                        'Remarks': item.Remarks,
                    })
                }
            }
            else {
                this.newDynamicShimpmentPOLGrid = { ID: 0, CntrTypeID: 0, ChargeOPT: 0, Amount2: 0, Remarks: "", CurrencyID: 146 };
                this.DynamicShimpmentPOLGrid.push(this.newDynamicShimpmentPOLGrid);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.bindExstingEnquiryShipmentPODList(this.Formvalues.value).subscribe((data) => {
            this.DynamicShimpmentPODGrid.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.DynamicShimpmentPODGrid.push({
                        'ID': item.ID,
                        'CntrTypeID': item.CntrTypeID,
                        'ChargeOPT': item.ChargeOPT,
                        'CurrencyID': item.CurrencyID,

                        'Amount2': item.Amount2,
                        'Remarks': item.Remarks,
                    })
                }
            }
            else {
                this.newDynamicShimpmentPODGrid = { ID: 0, CntrTypeID: 0, ChargeOPT: 0, Amount2: 0, Remarks: "", CurrencyID: 146 };
                this.DynamicShimpmentPODGrid.push(this.newDynamicShimpmentPODGrid);

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.bindExstingEnquiryFreightRateList(this.Formvalues.value).subscribe((data) => {
            this.fillFreightDynamicgrid.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillFreightDynamicgrid.push({
                        'ID': item.ID,
                        'CntrType': item.CntrType,
                        'CntrTypeID': item.CntrTypeID,
                        'Nos': item.Nos,
                        'PerAmount': item.PerAmount,
                        'TotalAmount': item.TotalAmount,
                        'Currency': item.Currency,
                        'ManifestPerAmount': item.ManifestPerAmount,
                        'ManifestTotalAmount': item.ManifestTotalAmount,
                        'CommPerAmount': item.CommPerAmount,
                        'CommTotal': item.CommTotal,
                        'Commodity': item.Commodity,
                        'CommodityID': item.CommodityID,
                        'CurrencyID': item.CurrencyID,
                    });
                }
            }
            else {
                this.fillFreightDynamicgrid.length = 0;

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.bindExstingEnquirySlotList(this.Formvalues.value).subscribe((data) => {
            this.fillSlotDynamicgrid.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillSlotDynamicgrid.push({
                        'ID': item.ID,
                        'CntrType': item.CntrType,
                        'CntrTypeID': item.CntrTypeID,
                        'Nos': item.Nos,
                        'PerAmount': item.PerAmount,
                        'TotalAmount': item.TotalAmount,
                        'Currency': item.Currency,
                        'ManifestPerAmount': item.ManifestPerAmount,
                        'ManifestTotalAmount': item.ManifestTotalAmount,
                        'CommPerAmount': item.CommPerAmount,
                        'CommTotal': item.CommTotal,
                        'Commodity': item.Commodity,
                        'CommodityID': item.CommodityID,
                        'CurrencyID': item.CurrencyID,
                    });
                }
            }
            else {
                this.newfillSlotDynamicgrid = { ID: 0, CntrTypeID: 0, CommodityID: 0, CurrencyID: 0, Nos: 0, PerAmount: 0, ManifestPerAmount: 0, ManifestTotalAmount: 0, TotalAmount: 0 };
                this.fillSlotDynamicgrid.push(this.newfillSlotDynamicgrid);


            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });



        this.Formvalues = this.fb.group({
            ID: 0,
            RegID: 0,
            PortID: 0,
            CustomerID: 0,
            BkgPartyChk: 0,
            ShiperCheckBox: 0,
            ShipperID: 0,
            EnquiryNo: '',
            EnquiryDate: 0,
            EnquirySourceID: 0,
            EnquiryStatuID: 0,
            EnquiryStatusID: 0,
            ValidTillDate: '',
            SalesPersonID: 0,
            NominationID: 0,
            OriginID: 0,
            LoadPortID: 0,
            DischargePortID: 0,
            DestinationID: 0,
            RouteID: 0,
            DeliveryTermsID: 0,
            VesselID: 0,
            VoyagID: 0,
            POLTerminalID: 0,
            TranshipmentPortID: 0,
            TxtTSVessel: '',
            TxtTSVoyage: '',
            CargoID: 0,
            CargoWeight: '',
            HSCode: '',
            PrincibalID: 0,
            RateApproval: '',
            CustomerContract: '',
            AttachedRateApprovals: '',
            PODAgentID: 0,
            FPODAgentID: 0,
            TsPort1AgentID: 0,
            TsPort2AgentID: 0,
            PaymentTermsID: 0,
            ChargeHead: 0,
            ItemsHarz: '',
            HazarOpt: 1,
            ReeferOpt: 1,
            OOGOpt: 1,
            FreeDayOrigin: 1,
            NumberOfDays: '',
            FreeDestination: 1,
            NumberOfDaysDestin: '',
            FreeDayDestination: 1,
            DamageScheme: 1,
            SecurityDeposit: 1,
            BOLRequirement: 1,
            txtDamageScheme: '',
            txtSecurityDeposit: '',
            txtBOLRequirement: '',
            SessionFinYear: '',
            AgentCode: '',
        });
    }


    btnAddCntrNoGrid(gRow, i) {

        var validation = "";

        if (gRow.CntrTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Cntr Type</span></br>"
        }
        if (gRow.Nos == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Nos</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }


        let Count20 = 0;
        let Count40 = 0;

        for (let item of this.DynamicCntrNoGrid) {
            if (item.CntrTypeID == "1")
                Count20 += 1;
            if (item.CntrTypeID == "2")
                Count40 += 1;
        }

        if (Count20 == 2) {
            gRow.CntrTypeID = "0";
            gRow.Nos = "0";
            Swal.fire("Container Type alerdy Exists");
            return;
        }
        if (Count40 == 2) {
            gRow.CntrTypeID = "0";
            gRow.Nos = "0";
            Swal.fire("Container Type alerdy Exists");
            return;
        }
        this.newDynamicCntrNoGrid = { ID: 0, CntrTypeID: 0, Nos: 0 };
        this.DynamicCntrNoGrid.push(this.newDynamicCntrNoGrid);
    }



    btnAddHazardousGrid(gRow, i) {
        this.newDynamicHazardousGrid = { ID: 0, HazarMCONo: "", HazarClass: "", CommodityID: "" };
        this.DynamicHazardousGrid.push(this.newDynamicHazardousGrid);
    }

    btnAddOutGaugeCargoGrid(gRow, i) {

        this.newDynamicOutGaugeCargoGrid = { ID: 0, CommodityID: "", Length: 0, Width: 0, Height: 0 };
        this.DynamicOutGaugeCargoGrid.push(this.newDynamicOutGaugeCargoGrid);
    }
    btnAddRefferGrid(gRow, i) {

        this.newDynamicReeferGrid = { ID: 0, CommodityID: "", Humidity: 0, Ventilation: 0, Temperature: 0 };
        this.DynamicReeferGrid.push(this.newDynamicReeferGrid);

    }
    btnAddShimpmentPOLGrid(gRow, i) {

        this.newDynamicShimpmentPOLGrid = {
            ID: 0, CntrTypeID: 0, ChargeOPT: 0, Amount2: 0, Remarks: "", CurrencyID: 146
        };
        this.DynamicShimpmentPOLGrid.push(this.newDynamicShimpmentPOLGrid);
    }

    btnAddShimpmentPODGrid(gRow, i) {

        this.newDynamicShimpmentPODGrid = {
            ID: 0, CntrTypeID: 0, ChargeOPT: 0, Amount2: 0, Remarks: "", CurrencyID: 146
        };
        this.DynamicShimpmentPODGrid.push(this.newDynamicShimpmentPODGrid);
    }


    btnAddFreightDynamicgrid(gRow, i) {

        var validation = "";

        if (gRow.CntrTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Cntr Type</span></br>"
        }
        if (gRow.Nos == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Nos</span></br>"
        }

        if (gRow.CommodityID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select Commodity</span></br>"
        }
        if (gRow.CurrencyID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select Currency</span></br>"
        }

        if (gRow.PerAmount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        this.newfillFreightDynamicgrid = { ID: 0, CntrTypeID: 0, CommodityID: 0, CurrencyID: 0, Nos: 0, PerAmount: 0, ManifestPerAmount: 0, CommPerAmount: 0, CommPerTotal: 0 };
        this.fillFreightDynamicgrid.push(this.newfillFreightDynamicgrid);


    }


    btnAddSlotDynamicgrid(gRow, i) {

        var validation = "";

        if (gRow.CntrTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Cntr Type</span></br>"
        }
        if (gRow.Nos == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Nos</span></br>"
        }

        if (gRow.CommodityID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select Commodity</span></br>"
        }
        if (gRow.CurrencyID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select Currency</span></br>"
        }

        if (gRow.PerAmount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Slot per container Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        this.newfillSlotDynamicgrid = { ID: 0, CntrTypeID: 0, CommodityID: 0, CurrencyID: 0, Nos: 0, PerAmount: 0, TotalAmount: 0, ManifestPerAmount: 0, ManifestTotalAmount: 0 };
        this.fillSlotDynamicgrid.push(this.newfillSlotDynamicgrid);


    }

    btnAddRevenuDynamicgrid(gRow, i) {
        var validation = "";

        if (gRow.CntrTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Cntr Type</span></br>"
        }
        if (gRow.Nos == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Nos</span></br>"
        }

        if (gRow.CommodityID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select Commodity</span></br>"
        }
        if (gRow.CurrencyID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select Currency</span></br>"
        }

        if (gRow.ChargeCodeID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select ChargeCode</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        this.newfillRevenuDynamicgrid = { ID: 0, CntrTypeID: 0, Nos: 0, CommodityID: 0, ChargeCodeID: 0, Amount: 0, UMOID: 0, TotalAmount: 0, CurrencyID: 0, ExRate: 0, PaymentTermsID: 0, CostAmount: 0, CostTotal: 0 };
        this.fillRevenuDynamicgrid.push(this.newfillRevenuDynamicgrid);

    }

    OnClickPOLPortTerminal(PortIDv) {

        this.Formvalues.value.PortID = PortIDv
        this.service.getTerminalList(this.Formvalues.value).subscribe(data => {
            this.fillLoadPortTerminal = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    OnClickAgencyTerminal(PrincibalID) {

        this.Formvalues.value.PrincibalID = PrincibalID
        this.service.getPrincibleAgenctPort(this.Formvalues.value).subscribe(data => {
            this.FillPriciblePortMaster = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.getPrincibleFreightCharges(this.Formvalues.value).pipe().subscribe(data => {
            if (data.length > 0) {

                this.fillFreightDynamicgrid.length = 0;
                for (let item of data) {
                    this.fillFreightDynamicgrid.push({
                        'ID': item.ID,
                        'CntrType': item.CntrType,
                        'CntrTypeID': item.CntrTypeID,
                        'Nos': item.Nos,
                        'PerAmount': item.PerAmount,
                        'TotalAmount': item.TotalAmount,
                        'Currency': item.Currency,
                        'ManifestPerAmount': item.ManifestPerAmount,
                        'ManifestTotalAmount': item.ManifestTotalAmount,
                        'CommPerAmount': item.CommPerAmount,
                        'CommTotal': item.CommTotal,
                        'Commodity': item.Commodity,
                        'CommodityID': item.CommodityID,
                        'CurrencyID': item.CurrencyID,
                    });
                }
            }
            else {
                this.fillFreightDynamicgrid.length = 1;
            }



        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getPrincibleRevenuCharges(this.Formvalues.value).pipe().subscribe(data => {
            if (data.length > 0) {
                this.fillRevenuDynamicgrid.length = 0;
                for (let item of data) {
                    this.fillRevenuDynamicgrid.push({
                        'ID': item.ID,
                        'CntrType': item.CntrType,
                        'CntrTypeID': item.CntrTypeID,
                        'Nos': item.Nos,
                        'UOM': item.UOM,
                        'PaymentTerms': item.PaymentTerms,
                        'CostAmount': item.CostAmount,
                        'TotalAmount': item.TotalAmount,
                        'Currency': item.Currency,
                        'Commodity': item.Commodity,
                        'CommodityID': item.CommodityID,
                        'Amount': item.Amount,
                        'ChargeCode': item.ChargeCode,
                        'ChargeCodeID': item.ChargeCodeID,
                        'CurrencyID': item.CurrencyID,
                        'PaymentTermID': item.PaymentTermID,
                        'ExRate': item.ExRate,
                        'TotalCostAmount': item.TotalCostAmount,
                        'BasicID': item.BasicID
                    });
                }
            }
            else {
                this.fillRevenuDynamicgrid.length = 1;
            }



        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });



    }

    onSubmit() {

        var validation = "";
        var CustomerID = $('#CustomerID').val();
        if (CustomerID == null || CustomerID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Customer</span></br>"
        }

        var OfficeCode = $('#OfficeCode').val();
        if (OfficeCode == null || OfficeCode == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Office Code</span></br>"
        }

        var EnquiryDate = $('#EnquiryDate').val();
        if (EnquiryDate == null || EnquiryDate == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Enquiry Date</span></br>"
        }
        var EnquiryStatusID = $('#EnquiryStatusID').val();
        if (EnquiryStatusID == null || EnquiryStatusID == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Enquiry Status</span></br>"
        }

        var EnquirySourceID = $('#EnquirySourceID').val();
        if (EnquirySourceID == null || EnquirySourceID == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Enquiry Source</span></br>"
        }
        if (EnquirySourceID == "1") {
            var SalesPersonID = $('#SalesPersonID').val();
            if (SalesPersonID == null || SalesPersonID == 0) {
                validation += "<span style='color:red;'>*</span> <span>Please Select Sales Person</span></br>"
            }
        }
        else {

            var NominationID = $('#NominationID').val();
            if (NominationID == null || NominationID == 0) {
                validation += "<span style='color:red;'>*</span> <span>Please Select Agent</span></br>"
            }
        }

        var BookingCommissionID = $('#BookingCommissionID').val();
        if (BookingCommissionID == null || BookingCommissionID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Commission</span></br>"
        }

        var OriginID = $('#OriginID').val();
        if (OriginID == null || OriginID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Origin</span></br>"
        }

        var LoadPortID = $('#LoadPortID').val();
        if (LoadPortID == null || LoadPortID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Load Port</span></br>"
        }

        var DischargePortID = $('#DischargePortID').val();
        if (DischargePortID == null || DischargePortID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Discharge Port</span></br>"
        }

        var DestinationID = $('#DestinationID').val();
        if (DestinationID == null || DestinationID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Destination Port</span></br>"
        }

        var RouteID = $('#RouteID').val();
        if (RouteID == null || RouteID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Route</span></br>"
        }

        var DeliveryTermsID = $('#DeliveryTermsID').val();
        if (DeliveryTermsID == null || DeliveryTermsID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Delivery Terms</span></br>"
        }

        var Commodity = $('#Commodity').val();
        if (Commodity == null || Commodity == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select  Commodity</span></br>"
        }
        var CargoWeight = $('#CargoWeight').val();
        if (CargoWeight == null || CargoWeight == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter  Gross Weight</span></br>"
        }
        //var HSCode = $('#HSCode').val();
        //if (HSCode == null || HSCode == "") {
        //    validation += "<span style='color:red;'>*</span> <span>Please Enter  Hs code</span></br>"
        //}

        var PayTermsID = $('#PayTermsID').val();
        if (PayTermsID == null || PayTermsID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select Payment Terms</span></br>"
        }

        if (RouteID == "182") {
            var TranshipmentPortID = $('#TranshipmentPortID').val();
            if (TranshipmentPortID == null || TranshipmentPortID == "") {
                validation += "<span style='color:red;'>*</span> <span>Please select Transhipment Port</span></br>"
            }
        }

        for (let item of this.DynamicCntrNoGrid) {
            if (item.CntrTypeID == "0") {
                validation += "<span style='color:red;'>*</span> <span>Please select Container Types</span></br>"
            }
        }
        var CntrTruevalue = 0;
        for (let item of this.DynamicCntrNoGrid) {
            var CntrTableID = item.CntrTypeID
            for (let item of this.fillFreightDynamicgrid) {
                var FritCntrID = item.CntrTypeID
                if (FritCntrID == CntrTableID) {
                    CntrTruevalue = 0;
                }
                else {
                    CntrTruevalue = 1;
                }
            }
        }
        if (CntrTruevalue == 1) {
            validation += "<span style='color:red;'>*</span> <span>Container Type and Freight Manifest Container not equal</span></br>"
        }


        var CntrNoTruevalue = 0;
        for (let item of this.DynamicCntrNoGrid) {
            var CntrNoTableID = item.Nos
            for (let item of this.fillFreightDynamicgrid) {
                var FritNoCntrID = item.Nos
                if (FritNoCntrID == CntrNoTableID) {
                    CntrNoTruevalue = 0;
                }
                else {
                    CntrNoTruevalue = 1;
                }
            }
        }
        if (CntrNoTruevalue == 1) {
            validation += "<span style='color:red;'>*</span> <span>Container Nos and Freight Manifest Container Nos not equal</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }


        this.Formvalues.value.CustomerID = $('#CustomerID').val();
        this.Formvalues.value.ShipperID = $('#ShipperID').val();
        this.Formvalues.value.EnquirySourceID = $('#EnquirySourceID').val();
        this.Formvalues.value.EnquiryStatusID = $('#EnquiryStatusID').val();
        this.Formvalues.value.BookingCommissionID = $('#BookingCommissionID').val();

        if ($('#EnquirySourceID').val() == "1")
            this.Formvalues.value.SalesPersonID = $('#SalesPersonID').val();
        else {
            var nnn = $('#NominationID').val();
            this.Formvalues.value.SalesPersonID = $('#NominationID').val();
        }

        this.Formvalues.value.OriginID = $('#OriginID').val();
        this.Formvalues.value.LoadPortID = $('#LoadPortID').val();
        this.Formvalues.value.DischargePortID = $('#DischargePortID').val();
        this.Formvalues.value.DestinationID = $('#DestinationID').val();
        this.Formvalues.value.RouteID = $('#RouteID').val();


        if ($('#VesselID').val() != "" && $('#VesselID').val() != null) {
            this.Formvalues.value.VesselID = $('#VesselID').val();
        }
        else
            this.Formvalues.value.VesselID = 0;

        if ($('#VoyagID').val() != "" && $('#VoyagID').val() != null)
            this.Formvalues.value.VoyagID = $('#VoyagID').val();
        else
            this.Formvalues.value.VoyagID = 0;

        this.Formvalues.value.POLTerminalID = $('#POLTerminalID').val();


        if ($('#TranshipmentPortID').val() != "" && $('#TranshipmentPortID').val() != null)
            this.Formvalues.value.TranshipmentPortID = $('#TranshipmentPortID').val();
        else
            this.Formvalues.value.TranshipmentPortID = 0;

        this.Formvalues.value.CargoID = $('#CargoID').val();

        if ($('#PrincibalID').val() != "" && $('#PrincibalID').val() != null)
            this.Formvalues.value.PrincibalID = $('#PrincibalID').val();
        else
            this.Formvalues.value.PrincibalID = 0;

        this.Formvalues.value.PODAgentID = $('#PODAgentID').val();
        this.Formvalues.value.FPODAgentID = $('#FPODAgentID').val();
        this.Formvalues.value.DeliveryTermsID = $('#DeliveryTermsID').val();
        this.Formvalues.value.PayTermsID = $('#PayTermsID').val();

        this.Formvalues.value.NumberOfDays = $('#NumberOfDays').val();
        this.Formvalues.value.NumberOfDaysDestin = $('#NumberOfDaysDestin').val();


        if ($('#CustomerContract').val() != "" && $('#CustomerContract').val() != null) {
            this.Formvalues.value.CustomerContractID = $('#CustomerContract').val();
        }
        else {
            this.Formvalues.value.CustomerContractID = 0;
        }

        if ($('#LineContract').val() != "" && $('#LineContract').val() != null) {
            this.Formvalues.value.LineContractID = $('#LineContract').val();
        }
        else {
            this.Formvalues.value.LineContractID = 0;
        }

        if ($('#OfficeCode').val() != "" && $('#OfficeCode').val() != null) {
            this.Formvalues.value.OfficeCode = $('#OfficeCode').val();
        }
        else {
            this.Formvalues.value.OfficeCode = 0;
        }



        this.Formvalues.value.SessionFinYear = "2022";
        this.Formvalues.value.AgentCode = "NVO";

        this.Formvalues.value.SeqNo = 0;
        this.Formvalues.value.PageName = "BookingEnquiries";
        this.Formvalues.value.UserID = localStorage.getItem("UserID");


        var ItemsCntr = [];
        for (let item of this.DynamicCntrNoGrid) {
            if (item.CntrTypeID != null) {
                ItemsCntr.push('Insert:' + item.CntrTypeID, item.Nos

                );
            }
        }
        this.Formvalues.value.ItemsCntr = ItemsCntr.toString();

        var ItemsHarz = [];
        for (let item of this.DynamicHazardousGrid) {
            if (item.CommodityID != 0)
                ItemsHarz.push('Insert:' + item.CommodityID, item.HazarClass, item.HazarMCONo);
        }
        this.Formvalues.value.ItemsHarz = ItemsHarz.toString();

        var ItemsOutGaugeCargo = [];
        for (let item of this.DynamicOutGaugeCargoGrid) {
            if (item.CommodityID != 0)
                ItemsOutGaugeCargo.push('Insert:' + item.CommodityID, item.Length, item.Width, item.Height);
        }
        this.Formvalues.value.ItemsOutGaugeCargo = ItemsOutGaugeCargo.toString();

        var ItemsReeferGrid = [];
        for (let item of this.DynamicReeferGrid) {
            if (item.CommodityID != 0)
                ItemsReeferGrid.push('Insert:' + item.CommodityID, item.Temperature, item.Ventilation, item.Humidity);
        }
        this.Formvalues.value.ItemsReeferGrid = ItemsReeferGrid.toString();

        var ItemShimpmentPOL = [];
        for (let item of this.DynamicShimpmentPOLGrid) {
            if (item.CntrTypeID != null)
                ItemShimpmentPOL.push('Insert:' + item.CntrTypeID, item.ChargeOPT, item.Amount2, item.Remarks, item.CurrencyID);
        }
        this.Formvalues.value.ItemShimpmentPOL = ItemShimpmentPOL.toString();

        var ItemShimpmentPOD = [];
        for (let item of this.DynamicShimpmentPODGrid) {
            if (item.CntrTypeID != null)
                ItemShimpmentPOD.push('Insert:' + item.CntrTypeID, item.ChargeOPT, item.Amount2, item.Remarks, item.CurrencyID);
        }
        this.Formvalues.value.ItemShimpmentPOD = ItemShimpmentPOD.toString();

        var ItemFreightRate = [];
        for (let item of this.fillFreightDynamicgrid) {
            if (item.CntrTypeID != null)
                ItemFreightRate.push('Insert:' + item.CntrTypeID, item.Nos, item.CommodityID, item.PerAmount,
                    item.ManifestPerAmount, item.CommPerAmount, item.CurrencyID);
        }
        this.Formvalues.value.ItemFreightRate = ItemFreightRate.toString();

        var ItemRevenueCostRate = [];
        for (let item of this.fillRevenuDynamicgrid) {
            if (item.CntrTypeID != null) {
                ItemRevenueCostRate.push('Insert:' +
                    item.CntrTypeID,
                    item.Nos,
                    item.CommodityID, item.ChargeCodeID, item.Amount, item.BasicID, item.TotalAmount,
                    item.CurrencyID, item.ExRate, item.PaymentTermID, item.CostAmount, item.TotalCostAmount);
            }
        }
        this.Formvalues.value.ItemRevenueCostRate = ItemRevenueCostRate.toString();

        var ItemSlotRate = [];
        for (let item of this.fillSlotDynamicgrid) {
            if (item.CntrTypeID != null) {
                ItemSlotRate.push('Insert:' + item.CntrTypeID, item.Nos, item.CommodityID, item.CurrencyID, item.PerAmount, item.TotalAmount,
                    item.ManifestPerAmount, item.ManifestTotalAmount);
            }
        }
        this.Formvalues.value.ItemSlotRate = ItemSlotRate.toString();

        this.service.EnquirySaveList(this.Formvalues.value).subscribe((data) => {

            if (data.length > 0) {
                this.Formvalues.value.ID = data[0].ID;
                this.RegId = data[0].ID;
                this.Formvalues.value.BookingNo = data[0].EnquiryNo;
                this.Formvalues.get('EnquiryNo').patchValue(data[0].EnquiryNo);
                //this.functionHidshow($('#EnquiryStatusID').val());
                if (data[0].AlertMegId == 1) {
                    Swal.fire(data[0].AlertMessage);
                }
                else if (data[0].AlertMegId == 2) {
                    Swal.fire(data[0].AlertMessage);
                }
                setTimeout(() => {
                    this.router.navigate(['/views/enquiries-booking/enquiries/enquiriesview/enquiriesview']);
                }, 2000);
                // this.existingAfterSave();
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


    }


    StandardOrgChange(value) {

        if (value == "1") {
            this.Formvalues.controls.NumberOfDays.setValue('');
            this.Formvalues.controls['NumberOfDays'].disable();

        }
        if (value == "2") {

            //this.Formvalues.controls.NumberOfDays.setValue('');
            this.Formvalues.controls['NumberOfDays'].enable();
        }
    }

    StandardDestination(value) {

        if (value == "1") {
            this.Formvalues.controls.NumberOfDaysDestin.setValue('');
            this.Formvalues.controls['NumberOfDaysDestin'].disable();

        }
        if (value == "2") {

            //this.Formvalues.controls.NumberOfDaysDestin.setValue('');
            this.Formvalues.controls['NumberOfDaysDestin'].enable();
        }
    }

    StandardDamageSchema(value) {

        if (value == "1") {
            this.Formvalues.controls.txtDamageScheme.setValue('');
            this.Formvalues.controls['txtDamageScheme'].disable();

        }
        if (value == "2") {

            // this.Formvalues.controls.txtDamageScheme.setValue('');
            this.Formvalues.controls['txtDamageScheme'].enable();
        }
    }

    StandardSecurityDeposit(value) {

        if (value == "1") {
            this.Formvalues.controls.txtSecurityDeposit.setValue('');
            this.Formvalues.controls['txtSecurityDeposit'].disable();

        }
        if (value == "2") {

            //this.Formvalues.controls.txtSecurityDeposit.setValue('');
            this.Formvalues.controls['txtSecurityDeposit'].enable();
        }
    }

    StandardBOLRequirment(value) {

        if (value == "1") {
            this.Formvalues.controls.txtBOLRequirement.setValue('');
            this.Formvalues.controls['txtBOLRequirement'].disable();

        }
        if (value == "2") {

            // this.Formvalues.controls.txtBOLRequirement.setValue('');
            this.Formvalues.controls['txtBOLRequirement'].enable();
        }
    }

    private formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
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


    AddAttach() {
        var validation = "";


        var txtAttachName = $('#txtAttachName').val();
        if (txtAttachName.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Attach Name</span></br>"
        }
        var txtAttachFile = $('#txtAttachFile').val();
        if (txtAttachFile.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Upload File</span></br>"
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }

        var AIDValue;
        AIDValue = (this.AID == null) ? 0 : this.AID;

        this.val = {

            AID: AIDValue,
            AttachName: $("#txtAttachName").val(),
            AttachFile: $("#txtAttachFile").val(),
        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGridAttachLink[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGridAttachLink.push(this.val);
        }

        $("#txtAttachName").val("");
        $("#txtAttachFile").val("");

        this.HDArrayIndex = "";

    }
    Freightbreakup() {

        this.Formvalues.value.Type = 1;
        this.service.bindExstingEnquiryFreightBrackupList(this.Formvalues.value).subscribe((data) => {
            this.fillFreightBrackup.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillFreightBrackup.push({
                        'ID': item.ID,
                        'ChargeCodeID': item.ChargeCodeID,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount,

                    });
                }
            }
            else {
                this.newfillFreightBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 0, Amount: 0 };
                this.fillFreightBrackup.push(this.newfillFreightBrackup);

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        $('#FreightBrackupChargesModal').modal('show');

    }
    Menifestbreakup() {

        this.Formvalues.value.Type = 2;
        this.service.bindExstingEnquiryFreightBrackupList(this.Formvalues.value).subscribe((data) => {
            this.fillManifestBrackup.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillManifestBrackup.push({
                        'ID': item.ID,
                        'ChargeCodeID': item.ChargeCodeID,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount,

                    });
                }
            }
            else {
                this.newfillManifestBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 0, Amount: 0 };
                this.fillManifestBrackup.push(this.newfillManifestBrackup);


            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        $('#ManifestBrackupChargesModal').modal('show');
    }

    SlotFreightbreakup() {

        this.Formvalues.value.Type = 3;
        this.service.bindExstingEnquiryFreightBrackupList(this.Formvalues.value).subscribe((data) => {
            this.fillSlotFreightBrackup.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillSlotFreightBrackup.push({
                        'ID': item.ID,
                        'ChargeCodeID': item.ChargeCodeID,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount,

                    });
                }
            }
            else {
                this.newfillSlotFreightBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 0, Amount: 0 };
                this.fillSlotFreightBrackup.push(this.newfillSlotFreightBrackup);


            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        $('#slotFreightBrackupChargesModal').modal('show');


    }

    SlotManifestbreakup() {

        this.Formvalues.value.Type = 4;
        this.service.bindExstingEnquiryFreightBrackupList(this.Formvalues.value).subscribe((data) => {
            this.fillSlotManifestBrackup.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillSlotManifestBrackup.push({
                        'ID': item.ID,
                        'ChargeCodeID': item.ChargeCodeID,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount,

                    });
                }
            }
            else {
                this.newfillSlotManifestBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 0, Amount: 0 };
                this.fillSlotManifestBrackup.push(this.newfillSlotManifestBrackup);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        $('#SlotManifestBrackupChargesModal').modal('show');
    }

    btnAddFreightBrackupDynamicgrid(gRow, i) {

        var validation = "";

        if (gRow.CurrencyID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select Currency</span></br>"
        }
        if (gRow.ChargeCodeID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select ChargeCode</span></br>"
        }
        if (gRow.Amount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        this.newfillFreightBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 0, Amount: 0 };
        this.fillFreightBrackup.push(this.newfillFreightBrackup);
    }

    btnAddManifestBrackupDynamicgrid(gRow, i) {

        var validation = "";

        if (gRow.CurrencyID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select Currency</span></br>"
        }
        if (gRow.ChargeCodeID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select ChargeCode</span></br>"
        }
        if (gRow.Amount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        this.newfillManifestBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 0, Amount: 0 };
        this.fillManifestBrackup.push(this.newfillManifestBrackup);
    }

    btnAddSlotFreightBrackupDynamicgrid(gRow, i) {

        var validation = "";

        if (gRow.CurrencyID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select Currency</span></br>"
        }
        if (gRow.ChargeCodeID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select ChargeCode</span></br>"
        }
        if (gRow.Amount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        this.newfillSlotFreightBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 0, Amount: 0 };
        this.fillSlotFreightBrackup.push(this.newfillSlotFreightBrackup);
    }


    btnAddSlotManifestBrackupDynamicgrid(gRow, i) {

        var validation = "";

        if (gRow.CurrencyID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select Currency</span></br>"
        }
        if (gRow.ChargeCodeID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please select ChargeCode</span></br>"
        }
        if (gRow.Amount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        this.newfillSlotManifestBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 0, Amount: 0 };
        this.fillSlotManifestBrackup.push(this.newfillSlotManifestBrackup);
    }

    OnclickFreightBrackupRecordSave() {

        var AmountCheck = 0;
        for (let item of this.fillFreightBrackup) {
            AmountCheck += parseFloat(item.Amount);
        }
        var AmountFreight = 0;
        for (let item of this.fillFreightDynamicgrid) {
            AmountFreight += parseFloat(item.PerAmount);
        }
        if (AmountCheck != AmountFreight) {

            Swal.fire("Freight Amount and Brackup Amount should be Matched");
            return;
        }

        var ItemFreightBrackup = [];
        for (let item of this.fillFreightBrackup) {
            ItemFreightBrackup.push('Insert:' + item.ChargeCodeID, item.CurrencyID, item.Amount)

        }


        this.Formvalues.value.ItemFreightBrackup = ItemFreightBrackup.toString();
        this.Formvalues.value.Type = 1;

        this.service.EnquiryFreightBrackupSaveList(this.Formvalues.value).subscribe((data) => {

            if (data.length > 0) {
                this.Formvalues.value.ID = data[0].ID;
                this.RegId = data[0].ID;
                if (data[0].AlertMegId == 1) {
                    Swal.fire(data[0].AlertMessage);
                }
                else if (data[0].AlertMegId == 2) {
                    Swal.fire(data[0].AlertMessage);
                }
                // this.existingAfterSave();
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        //

        this.Formvalues.value.Type = 1;
        this.service.bindExstingEnquiryFreightBrackupList(this.Formvalues.value).subscribe((data) => {
            this.fillFreightBrackup.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillFreightBrackup.push({
                        'ID': item.ID,
                        'ChargeCodeID': item.ChargeCodeID,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount,

                    });
                }
            }
            else {
                this.fillFreightBrackup.length = 0;

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });



    }
    OnclickfreightManifestBrackupRecordSave() {


        var AmountCheck = 0;
        for (let item of this.fillManifestBrackup) {
            AmountCheck += parseFloat(item.Amount);
        }
        var AmountFreight = 0;
        for (let item of this.fillFreightDynamicgrid) {
            AmountFreight += parseFloat(item.ManifestPerAmount);
        }
        if (AmountCheck != AmountFreight) {

            Swal.fire("Freight Amount and Brackup Amount should be Matched");
            return;
        }

        var ItemFreightBrackup = [];
        for (let item of this.fillManifestBrackup) {
            ItemFreightBrackup.push('Insert:' + item.ChargeCodeID, item.CurrencyID, item.Amount)
        }
        this.Formvalues.value.ItemFreightBrackup = ItemFreightBrackup.toString();
        this.Formvalues.value.Type = 2;

        this.service.EnquiryFreightBrackupSaveList(this.Formvalues.value).subscribe((data) => {

            if (data.length > 0) {
                this.Formvalues.value.ID = data[0].ID;
                this.RegId = data[0].ID;
                if (data[0].AlertMegId == 1) {
                    Swal.fire(data[0].AlertMessage);
                }
                else if (data[0].AlertMegId == 2) {
                    Swal.fire(data[0].AlertMessage);
                }

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.Formvalues.value.Type = 2;
        this.service.bindExstingEnquiryFreightBrackupList(this.Formvalues.value).subscribe((data) => {
            this.fillManifestBrackup.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillManifestBrackup.push({
                        'ID': item.ID,
                        'ChargeCodeID': item.ChargeCodeID,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount,

                    });
                }
            }
            else {
                this.fillManifestBrackup.length = 0;

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });




    }
    OnclickSlotFreightRecordSave() {


        var AmountCheck = 0;
        for (let item of this.fillSlotFreightBrackup) {
            AmountCheck += parseFloat(item.Amount);
        }
        var AmountFreight = 0;
        for (let item of this.fillSlotDynamicgrid) {
            AmountFreight += parseFloat(item.PerAmount);
        }
        if (AmountCheck != AmountFreight) {

            Swal.fire("Slot Amount and Brackup Amount should be Matched");
            return;
        }


        var ItemFreightBrackup = [];
        for (let item of this.fillSlotFreightBrackup) {
            ItemFreightBrackup.push('Insert:' + item.ChargeCodeID, item.CurrencyID, item.Amount)
        }
        this.Formvalues.value.ItemFreightBrackup = ItemFreightBrackup.toString();
        this.Formvalues.value.Type = 3;

        this.service.EnquiryFreightBrackupSaveList(this.Formvalues.value).subscribe((data) => {

            if (data.length > 0) {
                this.Formvalues.value.ID = data[0].ID;
                this.RegId = data[0].ID;
                if (data[0].AlertMegId == 1) {
                    Swal.fire(data[0].AlertMessage);
                }
                else if (data[0].AlertMegId == 2) {
                    Swal.fire(data[0].AlertMessage);
                }

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.Formvalues.value.Type = 3;
        this.service.bindExstingEnquiryFreightBrackupList(this.Formvalues.value).subscribe((data) => {
            this.fillSlotFreightBrackup.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillSlotFreightBrackup.push({
                        'ID': item.ID,
                        'ChargeCodeID': item.ChargeCodeID,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount,

                    });
                }
            }
            else {
                this.fillSlotFreightBrackup.length = 0;

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });




    }
    OnclickSlotManifestbrackupRecordSave() {

        var AmountCheck = 0;
        for (let item of this.fillSlotManifestBrackup) {
            AmountCheck += parseFloat(item.Amount);
        }
        var AmountFreight = 0;
        for (let item of this.fillSlotDynamicgrid) {
            AmountFreight += parseFloat(item.ManifestPerAmount);
        }
        if (AmountCheck != AmountFreight) {

            Swal.fire("Slot Amount and Brackup Amount should be Matched");
            return;
        }

        var ItemFreightBrackup = [];
        for (let item of this.fillSlotManifestBrackup) {
            ItemFreightBrackup.push('Insert:' + item.ChargeCodeID, item.CurrencyID, item.Amount)
        }
        this.Formvalues.value.ItemFreightBrackup = ItemFreightBrackup.toString();
        this.Formvalues.value.Type = 4;

        this.service.EnquiryFreightBrackupSaveList(this.Formvalues.value).subscribe((data) => {

            if (data.length > 0) {
                this.Formvalues.value.ID = data[0].ID;
                this.RegId = data[0].ID;
                if (data[0].AlertMegId == 1) {
                    Swal.fire(data[0].AlertMessage);
                }
                else if (data[0].AlertMegId == 2) {
                    Swal.fire(data[0].AlertMessage);
                }

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.Formvalues.value.Type = 4;
        this.service.bindExstingEnquiryFreightBrackupList(this.Formvalues.value).subscribe((data) => {
            this.fillSlotManifestBrackup.length = 0;
            if (data.length > 0) {
                for (let item of data) {
                    this.fillSlotManifestBrackup.push({
                        'ID': item.ID,
                        'ChargeCodeID': item.ChargeCodeID,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount,

                    });
                }
            }
            else {
                this.fillSlotManifestBrackup.length = 0;

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }


    //BindCommodityHSCode(Id) {

    //    this.Formvalues.value.CommodityID = Id;
    //    this.service.bindCommodityHSCode(this.Formvalues.value).subscribe((data) => {

    //        this.Formvalues.get('HSCode').patchValue(data[0].HSCode);

    //    }, (error: HttpErrorResponse) => {
    //        Swal.fire(error.message);
    //    });

    //}

    dropdowOnSelect(gRow) {

        let Count20 = 0;
        let Count40 = 0;
        for (let item of this.DynamicCntrNoGrid) {
            if (item.CntrTypeID == "1") {
                Count20 += 1;
            }
            if (item.CntrTypeID == "2") {
                Count40 += 1;
            }
        }

        if (Count20 == 2) {

            gRow.CntrTypeID = 0;
            gRow.Nos = "0";
            Swal.fire("Container Type alerdy Exists");
            return;
        }
        if (Count40 == 2) {

            gRow.CntrTypeID = 0;
            gRow.Nos = "0";
            Swal.fire("Container Type alerdy Exists");
            return;
        }

    }

    //FreightRateAmount(gRow) {

    //    gRow.CommPerAmount = gRow.PerAmount - gRow.ManifestPerAmount;
    //}



    DeleteAddHazardousGrid(gridvalue, index, Id) {
        this.DynamicHazardousGrid.splice(index, 1);
    }

    DynamicRefferDeleteGrid(gridvalue, index, Id) {
        this.DynamicReeferGrid.splice(index, 1);
    }
    DynamicOutGaugeCargoDeleteGrid(gridvalue, index, Id) {
        this.DynamicOutGaugeCargoGrid.splice(index, 1);
    }
    DynamicShimpmentPOLDeleteGrid(gridvalue, index, Id) {
        this.DynamicShimpmentPOLGrid.splice(index, 1);
    }

    DynamicShimpmentPODDeleteGrid(gridvalue, index, Id) {
        this.DynamicShimpmentPODGrid.splice(index, 1);
    }

    deleteFreightDynamicgrid(GridValue, index, Id) {
        this.fillFreightDynamicgrid.splice(index, 1);
    }


    btnDeleteFreightBrackupDynamicgrid(GridValue, index, ID) {
        this.fillFreightBrackup.splice(index, 1);
    }

    btnDeleteManifestBrackupDynamicgrid(GridValue, index, ID) {
        this.fillManifestBrackup.splice(index, 1);
    }
    btnDeleteSlotFreightBrackupDynamicgrid(GridValue, index, ID) {
        this.fillSlotFreightBrackup.splice(index, 1);
    }
    btnDeleteSlotManifestBrackupDynamicgrid(GridValue, index, ID) {
        this.fillSlotManifestBrackup.splice(index, 1);
    }
    deleteSlotDynamicgrid(GridValue, index, ID) {
        this.fillSlotDynamicgrid.splice(index, 1);
    }

    onApprove() {


        this.Formvalues.value.EnquiryStatusID = 2
        this.service.EnquiryStatusList(this.Formvalues.value).subscribe((data) => {
            this.functionHidshow(2);
            if (data.length > 0) {
                if (data[0].AlertMegId == 1) {
                    Swal.fire("Enquiry Approved");
                    setTimeout(() => {
                        this.router.navigate(['/views/enquiries-booking/enquiries/enquiriesview/enquiriesview']);
                    }, 2000);
                }
                else if (data[0].AlertMegId == 2) {
                    Swal.fire(data[0].AlertMessage);
                }

            }
            this.Formvalues.get('EnquiryStatusID').patchValue(2);
            $("#EnquiryStatusID").select2().val("2").trigger("change");

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    onReject() {
        $('#RejectReason').modal('show');

    }
    onCancel() {
        $('#CancelReason').modal('show');

    }

    functionHidshow(StatusID) {

        if (StatusID == 1) {
            this.showSave = true;
            this.showApprove = true;
            this.showReject = true;
            this.showCancel = true;
            this.GridShowing = true;
        }
        else {
            this.showSave = false;
            this.showApprove = false;
            this.showReject = false;
            this.showCancel = false;
        }
    }


    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }

    OnClickVoyageID(VesselID) {

        this.service.getVoyageList(VesselID).subscribe(data => {

            this.FillVoyageMaster = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    FreightCommodityCheck(gRow) {

        if (this.Formvalues.value.HazarOpt == 1) {
            if (gRow.CommodityID == 4)
                gRow.CommodityID = 0;

        } else if (this.Formvalues.value.HazarOpt == 2) {
            if (gRow.CommodityID == 3)
                gRow.CommodityID = 0;

        }

    }
    SlotCommodityCheck(gRow) {

        if (this.Formvalues.value.HazarOpt == 1) {
            if (gRow.CommodityID == 4)
                gRow.CommodityID = 0;

        } else if (this.Formvalues.value.HazarOpt == 2) {
            if (gRow.CommodityID == 3)
                gRow.CommodityID = 0;

        }
    }

    ForsControlEnable() {

        $('#OfficeCode').select2("enable", false);
        $('#CustomerID').select2("enable", false);
        $("#EnquiryDate").attr("disabled", "disabled");
        $('#EnquirySourceID').select2("enable", false);
        $("#SalesPersonID").select2("enable", false);
        $('#NominationID').select2("enable", false);
        $("#ValidTillDate").attr("disabled", "disabled");
        $('#BookingCommissionID').select2("enable", false);
        $('#OriginID').select2("enable", false);
        $('#LoadPortID').select2("enable", false);
        $('#DischargePortID').select2("enable", false);
        $('#DestinationID').select2("enable", false);
        $('#RouteID').select2("enable", false);
        $('#DeliveryTermsID').select2("enable", false);
        $('#CargoID').select2("enable", false);
        $('#PayTermsID').select2("enable", false);
        $('#VesselID').select2("enable", false);
        $('#VoyagID').select2("enable", false);

        $('#TranshipmentPortID').select2("enable", false);
        $('#PrincibalID').select2("enable", false);
        $('#CustomerContract').select2("enable", false);
        $('#LineContract').select2("enable", false);

        $("#CargoWeight").attr("disabled", "disabled");

        $("#NumberOfDays").attr("disabled", "disabled");
        $("#NumberOfDaysDestin").attr("disabled", "disabled");
        $("#txtDamageScheme").attr("disabled", "disabled");
        $("#txtBOLRequirement").attr("disabled", "disabled");
        $("#txtSecurityDeposit").attr("disabled", "disabled");
        $("#Commodity").attr("disabled", "disabled");

        $("#HazarOpt").prop("disabled", "disabled");
        $("#HazarOpt1").prop("disabled", "disabled");

        $("#ReeferOpt").prop("disabled", "disabled");
        $("#ReeferOpt1").prop("disabled", "disabled");

        $("#OOGOpt").prop("disabled", "disabled");
        $("#OOGOpt1").prop("disabled", "disabled");

        $("#BOLRequirement").prop("disabled", "disabled");
        $("#BOLRequirement1").prop("disabled", "disabled");

        $("#SecurityDeposit").prop("disabled", "disabled");
        $("#SecurityDeposit1").prop("disabled", "disabled");

        $("#DamageScheme").prop("disabled", "disabled");
        $("#DamageScheme1").prop("disabled", "disabled");

        $("#FreeDayDestination").prop("disabled", "disabled");
        $("#FreeDayDestination1").prop("disabled", "disabled");

        $("#FreeDayOrigin").prop("disabled", "disabled");
        $("#FreeDayOrigin1").prop("disabled", "disabled");




        this.ControlDisplay = true;

    }
    ForsControlDisable() {



        $('#OfficeCode').removeAttr('disabled');
        $("#CustomerID").removeAttr('disabled');
        $("#EnquiryDate").removeAttr("disabled");
        $("#EnquirySourceID").removeAttr('disabled');

        $("#ValidTillDate").removeAttr("disabled");
        $("#BookingCommissionID").removeAttr("disabled");
        $("#OriginID").removeAttr('disabled');
        $('#LoadPortID').removeAttr('disabled');
        $('#DischargePortID').removeAttr('disabled');
        $('#DestinationID').removeAttr('disabled');
        $('#RouteID').removeAttr('disabled');
        $('#DeliveryTermsID').removeAttr('disabled');
        $('#CargoID').removeAttr('disabled');
        $('#PayTermsID').removeAttr('disabled');
        $('#VesselID').removeAttr('disabled');
        $('#VoyagID').removeAttr('disabled');


        $('#PrincibalID').removeAttr('disabled');
        $('#CustomerContract').removeAttr('disabled');
        $('#LineContract').removeAttr('disabled');

        $("#CargoWeight").removeAttr('disabled');
        $("#HSCode").removeAttr('disabled');

        $("#NumberOfDays").removeAttr('disabled');
        $("#NumberOfDaysDestin").removeAttr('disabled');
        $("#txtDamageScheme").removeAttr('disabled');
        $("#txtBOLRequirement").removeAttr('disabled');
        $("#txtSecurityDeposit").removeAttr('disabled');

        $("#Commodity").removeAttr('disabled');
        $("#OOGOpt").removeAttr('disabled');
        $("#OOGOpt1").removeAttr('disabled');

        $("#HazarOpt").removeAttr("disabled");
        $("#HazarOpt1").removeAttr("disabled");

        $("#ReeferOpt").removeAttr("disabled");
        $("#ReeferOpt1").removeAttr("disabled");

        $("#BOLRequirement").removeAttr("disabled");
        $("#BOLRequirement1").removeAttr("disabled");

        $("#SecurityDeposit").removeAttr("disabled");
        $("#SecurityDeposit1").removeAttr("disabled");

        $("#DamageScheme").removeAttr("disabled");
        $("#DamageScheme1").removeAttr("disabled");

        $("#FreeDayDestination").removeAttr("disabled");
        $("#FreeDayDestination1").removeAttr("disabled");

        $("#FreeDayOrigin").removeAttr("disabled");
        $("#FreeDayOrigin1").removeAttr("disabled");

        $("#txtBOLRequirement").prop("disabled", "disabled");
        $("#txtSecurityDeposit").prop("disabled", "disabled");
        $("#txtDamageScheme").prop("disabled", "disabled");
        $("#NumberOfDaysDestin").prop("disabled", "disabled");
        //$("#NumberOfDays").prop("disabled", "disabled");

        if ($('#EnquirySourceID').val() == 1) {

            $("#SalesPersonID").removeAttr('disabled');

        }
        else {

            $("#NominationID").removeAttr('disabled');
        }

        if ($('#RouteID').val() == "182") {
            $('#TranshipmentPortID').removeAttr('disabled');
        }

        var FreeDayOriginvx = this.Formvalues.value.FreeDayOrigin
        if (FreeDayOriginvx == 2) {
            $("#NumberOfDays").removeAttr("disabled");

        }

        var FreeDayDestinationx = this.Formvalues.value.FreeDayDestination
        if (FreeDayDestinationx == 2) {
            $("#NumberOfDaysDestin").removeAttr("disabled");

        }
        var DamageSchemex = this.Formvalues.value.DamageScheme
        if (DamageSchemex == 2) {
            $("#txtDamageScheme").removeAttr("disabled");

        }
        var SecurityDepositx = this.Formvalues.value.SecurityDeposit
        if (SecurityDepositx == 2) {
            $("#txtSecurityDeposit").removeAttr("disabled");

        }
        var BOLRequirementx = this.Formvalues.value.BOLRequirement
        if (BOLRequirementx == 2) {
            $("#txtBOLRequirement").removeAttr("disabled");

        }
        if ($('#BookingCommissionID').val() == "1")
            this.disapleFreightCommision = false;
        else
            this.disapleFreightCommision = true;
        this.ControlDisplay = false;




    }

    OnClickCntrChageAllValues(gRow, index) {

        this.fillFreightDynamicgrid.length = 0;
        this.fillSlotDynamicgrid.length = 0;
        this.DynamicShimpmentPOLGrid.length = 0;
        this.DynamicShimpmentPODGrid.length = 0;

        for (let item of this.DynamicCntrNoGrid) {

            this.newfillFreightDynamicgrid = { ID: 0, CntrTypeID: item.CntrTypeID, CommodityID: 3, CurrencyID: 146, Nos: item.Nos, PerAmount: 0, ManifestPerAmount: 0, CommPerAmount: 0, CommPerTotal: 0 };
            this.fillFreightDynamicgrid.push(this.newfillFreightDynamicgrid);

            this.newfillSlotDynamicgrid = { ID: 0, CntrTypeID: item.CntrTypeID, CommodityID: 3, CurrencyID: 146, Nos: item.Nos, PerAmount: 0, ManifestPerAmount: 0, ManifestTotalAmount: 0, TotalAmount: 0 };
            this.fillSlotDynamicgrid.push(this.newfillSlotDynamicgrid);

            this.newDynamicShimpmentPOLGrid = { ID: 0, CntrTypeID: item.CntrTypeID, ChargeOPT: 1, Amount2: 0, Remarks: "", CurrencyID: 146 };
            this.DynamicShimpmentPOLGrid.push(this.newDynamicShimpmentPOLGrid);

            this.newDynamicShimpmentPODGrid = { ID: 0, CntrTypeID: item.CntrTypeID, ChargeOPT: 1, Amount2: 0, Remarks: "", CurrencyID: 146 };
            this.DynamicShimpmentPODGrid.push(this.newDynamicShimpmentPODGrid);
        }

    }

    DynamicDeleteCntrTypesGrid(DynamicGrid, index, Id) {
        if (this.DynamicCntrNoGrid.length == 1) {
            Swal.fire("Can't delete first row")
            return false;
        }

        var CntrTypeIDv = DynamicGrid[index].CntrTypeID;
        this.DynamicCntrNoGrid.splice(index, 1);
        this.Formvalues.value.EnqCntrID = Id;

        if (Id != 0) {
            this.service.DeleteEnqCntrType(this.Formvalues.value).subscribe((data) => {

            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });

            this.service.bindExstingEnquiryCntrTypeList(this.Formvalues.value).subscribe((data) => {
                this.DynamicCntrNoGrid.length = 0;
                if (data.length > 0) {
                    for (let item of data) {
                        this.DynamicCntrNoGrid.push({
                            'ID': item.ID,
                            'CntrTypeID': item.CntrTypeID,
                            'Nos': item.Nos,
                            'CntrTypes': item.CntrTypes
                        })
                    }
                }
                else {
                    this.newDynamicCntrNoGrid = { ID: 0, CntrTypeID: 0, CntrTypes: "", Nos: 0 };
                    this.DynamicCntrNoGrid.push(this.newDynamicCntrNoGrid);
                }
            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });

            this.service.bindExstingEnquiryShipmentPOLList(this.Formvalues.value).subscribe((data) => {
                this.DynamicShimpmentPOLGrid.length = 0;
                if (data.length > 0) {
                    for (let item of data) {
                        this.DynamicShimpmentPOLGrid.push({
                            'ID': item.ID,
                            'CntrTypeID': item.CntrTypeID,
                            'ChargeOPT': item.ChargeOPT,
                            'CurrencyID': item.CurrencyID,

                            'Amount2': item.Amount2,
                            'Remarks': item.Remarks,
                        })
                    }
                }
                else {
                    this.newDynamicShimpmentPOLGrid = { ID: 0, CntrTypeID: 0, ChargeOPT: 0, Amount2: 0, Remarks: "", CurrencyID: 146 };
                    this.DynamicShimpmentPOLGrid.push(this.newDynamicShimpmentPOLGrid);

                }
            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });


            this.service.bindExstingEnquiryShipmentPODList(this.Formvalues.value).subscribe((data) => {
                this.DynamicShimpmentPODGrid.length = 0;
                if (data.length > 0) {
                    for (let item of data) {
                        this.DynamicShimpmentPODGrid.push({
                            'ID': item.ID,
                            'CntrTypeID': item.CntrTypeID,
                            'ChargeOPT': item.ChargeOPT,
                            'CurrencyID': item.CurrencyID,

                            'Amount2': item.Amount2,
                            'Remarks': item.Remarks,
                        })
                    }
                }
                else {
                    this.newDynamicShimpmentPODGrid = { ID: 0, CntrTypeID: 0, ChargeOPT: 0, Amount2: 0, Remarks: "", CurrencyID: 146 };
                    this.DynamicShimpmentPODGrid.push(this.newDynamicShimpmentPODGrid);

                }
            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });


            this.service.bindExstingEnquiryFreightRateList(this.Formvalues.value).subscribe((data) => {
                this.fillFreightDynamicgrid.length = 0;
                if (data.length > 0) {
                    for (let item of data) {
                        this.fillFreightDynamicgrid.push({
                            'ID': item.ID,
                            'CntrType': item.CntrType,
                            'CntrTypeID': item.CntrTypeID,
                            'Nos': item.Nos,
                            'PerAmount': item.PerAmount,
                            'TotalAmount': item.TotalAmount,
                            'Currency': item.Currency,
                            'ManifestPerAmount': item.ManifestPerAmount,
                            'ManifestTotalAmount': item.ManifestTotalAmount,
                            'CommPerAmount': item.CommPerAmount,
                            'CommTotal': item.CommTotal,
                            'Commodity': item.Commodity,
                            'CommodityID': item.CommodityID,
                            'CurrencyID': item.CurrencyID,
                        });
                    }
                }
                else {
                    this.fillFreightDynamicgrid.length = 0;

                }
            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });


            this.service.bindExstingEnquirySlotList(this.Formvalues.value).subscribe((data) => {
                this.fillSlotDynamicgrid.length = 0;
                if (data.length > 0) {
                    for (let item of data) {
                        this.fillSlotDynamicgrid.push({
                            'ID': item.ID,
                            'CntrType': item.CntrType,
                            'CntrTypeID': item.CntrTypeID,
                            'Nos': item.Nos,
                            'PerAmount': item.PerAmount,
                            'TotalAmount': item.TotalAmount,
                            'Currency': item.Currency,
                            'ManifestPerAmount': item.ManifestPerAmount,
                            'ManifestTotalAmount': item.ManifestTotalAmount,
                            'CommPerAmount': item.CommPerAmount,
                            'CommTotal': item.CommTotal,
                            'Commodity': item.Commodity,
                            'CommodityID': item.CommodityID,
                            'CurrencyID': item.CurrencyID,
                        });
                    }
                }
                else {
                    this.newfillSlotDynamicgrid = { ID: 0, CntrTypeID: 0, CommodityID: 0, CurrencyID: 0, Nos: 0, PerAmount: 0, ManifestPerAmount: 0, ManifestTotalAmount: 0, TotalAmount: 0 };
                    this.fillSlotDynamicgrid.push(this.newfillSlotDynamicgrid);


                }
            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });
        }
        else {
            var IndexFt = 0;
            for (let item of this.fillFreightDynamicgrid) {

                if (CntrTypeIDv == item.CntrTypeID) {
                    this.fillFreightDynamicgrid.splice(IndexFt, 1);
                }
                IndexFt++;
            }
            IndexFt = 0;
            for (let item of this.DynamicShimpmentPOLGrid) {

                if (CntrTypeIDv == item.CntrTypeID) {
                    this.DynamicShimpmentPOLGrid.splice(IndexFt, 1);
                }
                IndexFt++;
            }
            IndexFt = 0;
            for (let item of this.DynamicShimpmentPODGrid) {

                if (CntrTypeIDv == item.CntrTypeID) {
                    this.DynamicShimpmentPODGrid.splice(IndexFt, 1);
                }
                IndexFt++;
            }
            IndexFt = 0;
            for (let item of this.fillSlotDynamicgrid) {

                if (CntrTypeIDv == item.CntrTypeID) {
                    this.fillSlotDynamicgrid.splice(IndexFt, 1);
                }
                IndexFt++;
            }


        }


    }
    OnclickeEdit() {

        //if (this.ValidStatusID == 2) {
        //    Swal.fire(localStorage.getItem("NotAllowed"));
        //    return;
        //}
        if ($("#EnquiryStatusID").val() != 1) {
            Swal.fire(localStorage.getItem("NotAllowed"));
            return;
        }

        if ($("#EnquiryStatusID").val() == 1) {

            this.disableSave = false;
            this.disableApprove = false;
            this.disableReject = false;
            this.disableCancel = false;

        }

        this.ForsControlDisable();
        //if ($("#FreeDayOrigin").val() == 1)
        //    this.Formvalues.controls['NumberOfDays'].disable();

        //if ($("#FreeDayDestination").val() == 1)
        //    this.Formvalues.controls['NumberOfDaysDestin'].disable();

        //if ($("#DamageScheme").val() == 1)
        //    this.Formvalues.controls['txtDamageScheme'].disable();
        //if ($("#SecurityDeposit").val() == 1)
        //    this.Formvalues.controls['txtSecurityDeposit'].disable();
        //if ($("#BOLRequirement").val() == 1)
        //    this.Formvalues.controls['txtBOLRequirement'].disable();


    }
    onSubmitReject() {

        this.Formvalues.value.EnquiryStatusID = 3
        this.Formvalues.value.RejectReasonID = $("#ddlReject").val();
        this.service.EnquiryStatusList(this.Formvalues.value).subscribe((data) => {
            this.functionHidshow(3);
            if (data.length > 0) {
                if (data[0].AlertMegId == 1) {
                    Swal.fire({
                        title: 'Lost Successfully',
                        showDenyButton: false,
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.router.navigate(['/views/enquiries-booking/enquiries/enquiriesview/enquiriesview']);
                        }
                    });
                    $('#RejectReason').modal('hide');
                   
                }
                else if (data[0].AlertMegId == 2) {
                    Swal.fire(data[0].AlertMessage);
                }

            }
            this.Formvalues.get('EnquiryStatusID').patchValue(3);
            $("#EnquiryStatusID").select2().val("3").trigger("change");
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    onSubmitCancel() {

        this.Formvalues.value.EnquiryStatusID = 4
        this.Formvalues.value.CancelReasonID = $("#ddlCancel").val();
        this.service.EnquiryStatusList(this.Formvalues.value).subscribe((data) => {
            this.functionHidshow(4);
            if (data.length > 0) {
                if (data[0].AlertMegId == 1) {
                    Swal.fire({
                        title: 'Cancelled Successfully',
                        showDenyButton: false,
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.router.navigate(['/views/enquiries-booking/enquiries/enquiriesview/enquiriesview']);
                        }
                    });
                    $('#CancelReason').modal('hide');
                }
                else if (data[0].AlertMegId == 2) {
                    Swal.fire(data[0].AlertMessage);
                }

            }
            this.Formvalues.get('EnquiryStatusID').patchValue(4);
            $("#EnquiryStatusID").select2().val("4").trigger("change");
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    PODDropdownOnChange(gRow) {
        if (gRow.ChargeOPT == 2) {
            gRow.Amount2 = "0";
            gRow.Remarks = "";
        }
    }
    POLDropdownOnChange(gRow) {

        if (gRow.ChargeOPT == 1) {
            gRow.Amount2 = "0";
            gRow.Remarks = "";
        }
    }

}
