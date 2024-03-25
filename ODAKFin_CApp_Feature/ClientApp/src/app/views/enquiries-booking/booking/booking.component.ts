import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { format } from 'util';
import { CommonValues, MyAgencyDropdown, MyCntrTypeDropdown, MyCustomerDropdown, MyPortdrodown, MyTerminaldrodown } from '../../../model/Admin';
import { BookingMaster } from '../../../model/booking';
import { Commodity, ContainerType, CTTypes, drodownVeslVoyage, GeneralMaster, Vessel, VoyageDetails, CurrencyMaster, ChargeTBMaster, MyAgency } from '../../../model/common';
import {
    MyCargoMaster, myCntrTypesDynamicGrid, mydropdownPort, myDynamicOutGaugeCargoGrid, myDynamicReeferGrid, myDynamicShimpmentPODGrid, myDynamicShimpmentPOLGrid,
    myenquiryFreightDynamicgrid, myenquiryRevenuDynamicgrid, myHazardousDynamicGrid, myFreightBrackupDynamicgrid, MyLinerDropdown, MyCustomerContractDropdown
} from '../../../model/enquiry';
import { BookingService } from '../../../services/booking.service';
import { EncrDecrServiceService } from '../../../services/encr-decr-service.service';
import { EnquiryService } from '../../../services/enquiry.service';
import { MastersService } from '../../../services/masters.service';
import { LogdetailsService } from '../../../services/logdetails.service';
declare let $: any;


@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

    CreatedOn: string = '';
    CreatedBy: string = '';
    ModifiedOn: string = '';
    ModifiedBy: string = '';


    AgencyMasterAllvalues: MyAgencyDropdown[];
    Formvalues: FormGroup;
    errorMsg: string;
    CustomerMasterAllvalues: MyCustomerDropdown[];
    SalesMasterAllvalues: MyCustomerDropdown[];

    AllListEnquirySource: CommonValues[];
    AllListBookingCommission: CommonValues[];
    AllListEnquireStatus: CommonValues[];
    OfficeMasterAllvalues: MyCustomerDropdown[];
    PortAllvalues: MyPortdrodown[];
    RouteTypes = "49";
    FillRouteTypes: GeneralMaster[];
    DeliveryTerms = "75";
    CommodityTerms = "2";
    StdSplvalues: CommonValues[];
    StdSplvaluesNew: CommonValues[];
    AllListPaymentTerms: CommonValues[];
    AllListUMOTerms: CommonValues[];
    FillDeliveryTerms: GeneralMaster[];
    fillVeslVoyage: drodownVeslVoyage[];
    FillTSVesselMaster: drodownVeslVoyage[]
    fillCntrType: MyCntrTypeDropdown[];
    fillLoadPortTerminal: MyTerminaldrodown[];
    fillCargo: MyCargoMaster[];
    FillCommodity: GeneralMaster[];
    fillPricibleMasterAllvalues: MyCustomerDropdown[];
    fileLinerMaster: MyLinerDropdown[];
    fileCustomerContactMaster: MyCustomerContractDropdown[];
    FillPriciblePortMaster: mydropdownPort[];
    ddlCommodityTypelItem: Commodity[];
    fillAgencyMaster: MyAgencyDropdown[];
    ddlHSCodeItem: Commodity[];
    ddlVesselItem: Vessel[];
    CurrencyValue: CurrencyMaster[];
    FillVoyageMaster: drodownVeslVoyage[];
    FillTSVoyageMaster: drodownVeslVoyage[];
    ChargeCodeAllvalues: ChargeTBMaster[];
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
    fillRevenuDynamicgrid: Array<myenquiryRevenuDynamicgrid> = [];

    newfillSlotDynamicgrid: any = [];
    fillSlotDynamicgrid: Array<myenquiryFreightDynamicgrid> = [];

    newfillFreightBrackup: any = [];
    fillFreightBrackup: Array<myFreightBrackupDynamicgrid> = [];
    newfillManifestBrackup: any = [];
    fillManifestBrackup: Array<myFreightBrackupDynamicgrid> = [];

    newfillSlotFreightBrackup: any = [];
    fillSlotFreightBrackup: Array<myFreightBrackupDynamicgrid> = [];

    newfillSlotManifestBrackup: any = [];
    fillSlotManifestBrackup: Array<myFreightBrackupDynamicgrid> = [];

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

    public showSave: boolean = true;
    public showConfirm: boolean = false;
    public disableSave: boolean = true;
    public disableApprove: boolean = false;
    public ControlDisplay: boolean = true;
    public showEdit: boolean = false;


    allExpandState = false;

    HazarOpt: number = 1;

    constructor(private router: Router, private route: ActivatedRoute, private service: EnquiryService, private fb: FormBuilder, private ES: EncrDecrServiceService, private masterservice: MastersService, private bookingservice: BookingService, private LS: LogdetailsService) { }

    ngOnInit() {

        this.newDynamicCntrNoGrid = { ID: 0, CntrTypeID: 0, CntrTypes: "", Nos: 0 };
        this.DynamicCntrNoGrid.push(this.newDynamicCntrNoGrid);

        this.newDynamicHazardousGrid = { ID: 0, HazarMCONo: "", HazarClass: "", CommodityID: 0 };
        this.DynamicHazardousGrid.push(this.newDynamicHazardousGrid);

        this.newDynamicOutGaugeCargoGrid = { ID: 0, CommodityID: 0, Length: 0, Width: 0, Height: 0 };
        this.DynamicOutGaugeCargoGrid.push(this.newDynamicOutGaugeCargoGrid);

        this.newDynamicReeferGrid = { ID: 0, CommodityID: 0, Humidity: 0, Ventilation: 0, Temperature: 0 };
        this.DynamicReeferGrid.push(this.newDynamicReeferGrid);


        //this.newDynamicShimpmentPOLGrid = { ID: 0, CntrTypeID: 0, ChargeOPT: 1, Amount2: 0, Remarks: "", CurrencyID: 146 };
        //this.DynamicShimpmentPOLGrid.push(this.newDynamicShimpmentPOLGrid);

        //this.newDynamicShimpmentPODGrid = { ID: 0, CntrTypeID: 0, ChargeOPT: 1, Amount2: 0, Remarks: "", CurrencyID: 146 };
        //this.DynamicShimpmentPODGrid.push(this.newDynamicShimpmentPODGrid);

        //this.newfillFreightDynamicgrid = { ID: 0, CntrTypeID: 0, CommodityID: 3, CurrencyID: 146, Nos: 0, PerAmount: 0, ManifestPerAmount: 0, CommPerAmount: 0, CommPerTotal: 0 };
        //this.fillFreightDynamicgrid.push(this.newfillFreightDynamicgrid);

        //this.newfillSlotDynamicgrid = { ID: 0, CntrTypeID: 0, CommodityID: 3, CurrencyID: 146, Nos: 0, PerAmount: 0, ManifestPerAmount: 0, ManifestTotalAmount: 0, TotalAmount: 0 };
        //this.fillSlotDynamicgrid.push(this.newfillSlotDynamicgrid);


        this.newfillFreightBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 146, Amount: 0 };
        this.fillFreightBrackup.push(this.newfillFreightBrackup);


        this.newfillManifestBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 146, Amount: 0 };
        this.fillManifestBrackup.push(this.newfillManifestBrackup);

        this.newfillSlotFreightBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 146, Amount: 0 };
        this.fillSlotFreightBrackup.push(this.newfillSlotFreightBrackup);


        this.newfillSlotManifestBrackup = { ID: 0, ChargeCodeID: 0, CurrencyID: 156, Amount: 0 };
        this.fillSlotManifestBrackup.push(this.newfillSlotManifestBrackup);




        this.createform();
        this.InitBind();
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

                this.Formvalues = this.fb.group({
                    ID: queryString["ID"].toString(),
                });

                this.ExistingEnquiryBind();
                this.createform();
            }

        });

        $('#ddlVesselID').on('select2:select', (e, args) => {
            this.OnClickVoyageID($("#ddlVesselID").val());
        });

        $('#TSVesselID').on('select2:select', (e, args) => {
            this.OnClickTSVoyageID($("#TSVesselID").val());
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
            EnquiryDate: '',
            EnquirySourceID: 0,
            BookingCommissionID: 0,
            EnquiryStatusID: 0,
            ValidTillDate: '',
            SalesPersonID: 0,
            OriginID: 0,
            LoadPortID: 0,
            DischargePortID: 0,
            DestinationID: 0,
            RouteID: 0,
            DeliveryTermsID: 0,
            VesselID: 0,
            VoyageID: 0,
            POLTerminalID: 0,
            TranshipmentPortID: 0,
            TxtTSVessel: '',
            TxtTSVoyage: '',
            CargoID: 0,
            CargoWeight: '',
            HSCode: '',
            PrincibleID: 0,
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
            PrincibalID: 0,
            SlotOperatorID: 0,
            FixedID: 1,
            OwnershipID: 1,
            TSAgentID: 0,
            TSTwoAgentID: 0,
            VoyagID: 0,
            TSVesselID: 0,
            TSVoyageID: 0,
            BookingStatus: '',
            EnqID: 0,
            BookingNo: '',
            OfficeCode: 0, NominationID: 0,






        });
        //this.StandardOrgChange(1);
        //this.StandardDestination(1);
        //this.StandardDamageSchema(1);
        //this.StandardSecurityDeposit(1);
        //this.StandardBOLRequirment(1);
    }

    InitBind() {

        this.InitDropdown();
    }

    InitDropdown() {
        this.service.getAgencyMasterList().subscribe(data => {
            this.AgencyMasterAllvalues = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
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
        ];

        this.AllListEnquireStatus = [
            { ID: "0", Desc: '--select--' },
            { ID: "1", Desc: 'Yes' },
            { ID: "2", Desc: 'No' },
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

        this.service.getGeneralList(this.CommodityTerms).subscribe(data => {
            this.FillCommodity = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getVslVoyList().subscribe(data => {
            this.fillVeslVoyage = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getVslVoyList().subscribe(data => {
            this.FillTSVesselMaster = data;
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


        this.bookingservice.getCommodityMasterList().subscribe(data => {
            this.ddlCommodityTypelItem = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getCurrencyList().subscribe(data => {
            this.CurrencyValue = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        //this.masterservice.getHSCode(this.Formvalues.value).subscribe(data => {
        //    this.ddlHSCodeItem = data;
        //}, (error: HttpErrorResponse) => {
        //    Swal.fire(error.message);
        //});

        this.masterservice.getVesselBind(this.Formvalues.value).subscribe(data => {
            this.ddlVesselItem = data;
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

        this.bookingservice.getAgencyMasterList().subscribe(data => {
            this.fillAgencyMaster = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getChargeCodeList().subscribe(data => {
            this.ChargeCodeAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    ExistingEnquiryBind() {

        this.Formvalues.value.LogInID = this.Formvalues.value.ID;
        this.Formvalues.value.SeqNo = 1;
        this.Formvalues.value.PageName = "Booking";
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
        this.Formvalues.value.PageName = "Booking";
        this.LS.getLogDetails(this.Formvalues.value).subscribe(data => {

            this.ModifiedOn = data[0].Date;
            this.ModifiedBy = data[0].UserName;
        });

        this.bookingservice.bindExstingBookingList(this.Formvalues.value).subscribe((data) => {

            this.Formvalues.patchValue(data[0]);
            if (data[0].VesselID.toString() != "")
                this.OnClickVoyageID(data[0].VesselID);
            if (data[0].TSVesselID.toString() != "") {
                this.OnClickTSVoyageID(data[0].TSVesselID);
            }
            else {
                this.OnClickTSVoyageID(0);
            }
            $('#CustomerID').select2().val(data[0].CustomerID);
            $('#ShipperID').select2().val(data[0].ShipperID);
            $('#EnquirySourceID').select2().val(data[0].EnquirySourceID);
            $('#EnquiryStatusID').select2().val(data[0].EnquiryStatusID);
            $('#BookingCommissionID').select2().val(data[0].BookingCommissionID);
            //$('#SalesPersonID').select2().val(data[0].SalesPersonID);

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

            $('#PODAgentID').select2().val(data[0].PODAgentID);
            $('#FPODAgentID').select2().val(data[0].FPODAgentID);

            $('#TSAgentID').select2().val(data[0].TSAgentID);
            $('#TSTwoAgentID').select2().val(data[0].TSTwoAgentID);
            $('#SlotOperatorID').select2().val(data[0].SlotOperatorID);
            $('#ddlVesselID').select2().val(data[0].VoyagID);
            $('#TSVesselID').select2().val(data[0].TSVesselID);
            $('#TSVoyageID').select2().val(data[0].TSVoyageID);
            $('#OfficeCode').select2().val(data[0].OfficeCode);


            //this.StandardOrgChange(data[0].FreeDayOrigin);
            //this.StandardDestination(data[0].FreeDayDestination);
            //this.StandardDamageSchema(data[0].DamageScheme);
            //this.StandardSecurityDeposit(data[0].SecurityDeposit);
            //this.StandardBOLRequirment(data[0].BOLRequirement);
            this.OnclickHazaropt(data[0].HazarOpt);
            this.OnclickReeferOpt(data[0].ReeferOpt);
            this.OnclickOOGOpt(data[0].OOGOpt);
            this.ForsControlEnable();
            if (this.Formvalues.value.BookingNo == "") {

                this.showConfirm = false;
                this.showSave = true;
                //this.disableSave = false;
                //this.ControlDisplay = false;

            }
            if (this.Formvalues.value.BookingNo != "") {

                if (this.Formvalues.value.BookingStatus == "CONFIRM") {

                    this.showSave = false;
                    this.showConfirm = false;
                    //this.disableApprove = true;
                    //this.ControlDisplay = true;
                    //this.disableSave = true;
                } else {
                    this.showConfirm = true;
                    this.showSave = true;
                    this.disableApprove = false;
                    this.disableSave = false;
                }

            }





        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.bookingservice.bindExstingEnquiryCntrTypeList(this.Formvalues.value).subscribe((data) => {
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

        this.bookingservice.bindExstingBookingHazardousList(this.Formvalues.value).subscribe((data) => {
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

        this.bookingservice.bindExstingBookingOutGaugeCargoList(this.Formvalues.value).subscribe((data) => {
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

        this.bookingservice.bindExstingBookingRefferList(this.Formvalues.value).subscribe((data) => {
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

        this.bookingservice.bindExstingBookingShipmentPOLList(this.Formvalues.value).subscribe((data) => {
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
                this.newDynamicShimpmentPOLGrid = { ID: 0, CntrTypeID: 0, ChargeOPT: 0, Amount2: 0, Amount3: 0, CurrencyID: 146 };
                this.DynamicShimpmentPOLGrid.push(this.newDynamicShimpmentPOLGrid);

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.bookingservice.bindExstingBookingShipmentPODList(this.Formvalues.value).subscribe((data) => {
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
                this.newDynamicShimpmentPODGrid = { ID: 0, CntrTypeID: 0, ChargeOPT: 0, Amount2: 0, Amount3: 0, CurrencyID: 146 };
                this.DynamicShimpmentPODGrid.push(this.newDynamicShimpmentPODGrid);

            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.bookingservice.bindExstingBookingFreightRateList(this.Formvalues.value).subscribe((data) => {
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


        this.bookingservice.bindExstingBookingSlotList(this.Formvalues.value).subscribe((data) => {

            if (data.length > 0) {
                // this.fillSlotDynamicgrid.length = 0;
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
        //

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

    onSubmit() {

        var validation = "";
        var PODAgentID = $('#PODAgentID').val();
        if (PODAgentID == null || PODAgentID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select POD Agent</span></br>"
        }

        var OfficeCode = $('#OfficeCode').val();
        if (OfficeCode == null || OfficeCode == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Office Code</span></br>"
        }

        //var FPODAgentID = $('#FPODAgentID').val();
        //if (FPODAgentID == null || FPODAgentID == "0") {
        //    validation += "<span style='color:red;'>*</span> <span>Please Select FPOD Agent</span></br>"
        //}

        //var TSAgentID = $('#TSAgentID').val();
        //if (TSAgentID == null || TSAgentID == "0") {
        //    validation += "<span style='color:red;'>*</span> <span>Please Select TS Port 1 Agent</span></br>"
        //}

        //var TSTwoAgentID = $('#TSTwoAgentID').val();
        //if (TSTwoAgentID == null || TSTwoAgentID == "0") {
        //    validation += "<span style='color:red;'>*</span> <span>Please Select TS Port 2 Agent</span></br>"
        //}

        var VesselID = $('#ddlVesselID').val();
        if (VesselID == null || VesselID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Vessel Name</span></br>"
        }


        var VoyageID = $('#ddlVoyageID').val();
        if (VoyageID == null || VoyageID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Voyage</span></br>"
        }


        var SlotOperatorID = $('#SlotOperatorID').val();
        if (SlotOperatorID == null || SlotOperatorID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select SlotOperator</span></br>"
        }

        //var TSVesselID = $('#TSVesselID').val();
        //if (TSVesselID == null || TSVesselID == "0") {
        //    validation += "<span style='color:red;'>*</span> <span>Please Select TSVessel</span></br>"
        //}

        //var TSVoyageID = $('#TSVoyageID').val();
        //if (TSVoyageID == null || TSVoyageID == "0") {
        //    validation += "<span style='color:red;'>*</span> <span>Please Select TSVoyage</span></br>"
        //}




        if (validation != "") {
            Swal.fire(validation);
            return false;
        }

        this.Formvalues.value.PODAgentID = $('#PODAgentID').val();
        this.Formvalues.value.VesselID = $('#ddlVesselID').val();
        this.Formvalues.value.VoyageID = $('#ddlVoyageID').val();
        this.Formvalues.value.SlotOperatorID = $('#SlotOperatorID').val();
        this.Formvalues.value.BkgDate = $('#SlotOperatorID').val();

        if ($('#FPODAgentID').val() != null && $('#FPODAgentID').val() != "")
            this.Formvalues.value.FPODAgentID = $('#FPODAgentID').val();
        else
            this.Formvalues.value.FPODAgentID = 0;


        if ($('#TSAgentID').val() != null && $('#TSAgentID').val() != "")
            this.Formvalues.value.TSAgentID = $('#TSAgentID').val();
        else
            this.Formvalues.value.TSAgentID = 0;

        if ($('#TSTwoAgentID').val() != null && $('#TSTwoAgentID').val() != "")
            this.Formvalues.value.TSTwoAgentID = $('#TSTwoAgentID').val();
        else
            this.Formvalues.value.TSTwoAgentID = 0;

        if ($('#TSVesselID').val() != null && $('#TSVesselID').val() != "")
            this.Formvalues.value.TSVesselID = $('#TSVesselID').val();
        else
            this.Formvalues.value.TSVesselID = 0;
        if ($('#TSVoyageID').val() != null && $('#TSVoyageID').val() != "")
            this.Formvalues.value.TSVoyageID = $('#TSVoyageID').val();
        else
            this.Formvalues.value.TSVoyageID = 0;

        this.Formvalues.value.SessionFinYear = "2022";
        this.Formvalues.value.SeqNo = 0;
        this.Formvalues.value.PageName = "Booking";
        this.Formvalues.value.UserID = localStorage.getItem("UserID");

        this.Formvalues.value.AgentCode = "NAV";
        if ($('#OfficeCode').val() != "" && $('#OfficeCode').val() != null) {
            this.Formvalues.value.OfficeCode = $('#OfficeCode').val();
        }
        else {
            this.Formvalues.value.OfficeCode = 0;
        }

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


        var ItemSlotRate = [];
        for (let item of this.fillSlotDynamicgrid) {
            if (item.CntrTypeID != null) {
                ItemSlotRate.push('Insert:' + item.CntrTypeID, item.Nos, item.CommodityID, item.CurrencyID, item.PerAmount, item.TotalAmount,
                    item.ManifestPerAmount, item.ManifestTotalAmount);
            }
        }
        this.Formvalues.value.ItemSlotRate = ItemSlotRate.toString();


        this.bookingservice.BookingSaveList(this.Formvalues.value).subscribe((data) => {

            if (data.length > 0) {
                this.Formvalues.value.ID = data[0].ID;
                this.RegId = data[0].ID;
                if (data[0].AlertMegId == 1) {
                    this.showSave = true;
                    this.disableSave = true;
                    this.showConfirm = true;
                    this.disableApprove = false;

                    this.Formvalues.value.BookingNo = data[0].BookingNo;
                    this.Formvalues.get('BookingNo').patchValue(data[0].BookingNo);
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


    }

    btntabclick(tab) {


        var values = "ID: " + this.Formvalues.value.ID;
        //var values = "ID: 8";
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1) {

            this.router.navigate(['/views/enquiries-booking/booking/booking'], { queryParams: { encrypted } });
        }
        else if (tab == 2) {
            this.router.navigate(['/views/enquiries-booking/croentry/croview/croview'], { queryParams: { encrypted } });
        }

    }


    FreightCntrCheck(gRow) {
        var validation = "";
        var Cntr20 = 0;
        var Cntr40 = 0;

        var CntrFreight20 = 0;
        var CntrFreight40 = 0;

        for (let item of this.DynamicCntrNoGrid) {
            if (item.CntrTypeID == "1")
                Cntr20 += 1;
            if (item.CntrTypeID == "2")
                Cntr40 += 1;
        }
        for (let item of this.fillFreightDynamicgrid) {
            if (item.CntrTypeID == "1")
                CntrFreight20 += 1;
            if (item.CntrTypeID == "2")
                CntrFreight40 += 1;
        }

        if (CntrFreight20 != Cntr20) {
            gRow.CntrTypeID = "0";
            validation += "<span style='color:red;'>*</span> <span>Container Type and Freight Mamifest Container not equal</span></br>"
            Swal.fire(validation);
        }
        if (CntrFreight40 != Cntr40) {
            gRow.CntrTypeID = "0";
            validation += "<span style='color:red;'>*</span> <span>Container Type and Freight Mamifest Container not equal</span></br>"
            Swal.fire(validation);
        }



    }

    FreightNosCheck(gRow) {


        var validation = "";
        var Cntr20 = 0;
        var Cntr40 = 0;

        var CntrFreight20 = 0;
        var CntrFreight40 = 0;

        for (let item of this.DynamicCntrNoGrid) {
            if (item.CntrTypeID == "1")
                Cntr20 += parseInt(item.Nos);
            if (item.CntrTypeID == "2")
                Cntr40 += parseInt(item.Nos);
        }
        for (let item of this.fillFreightDynamicgrid) {
            if (item.CntrTypeID == "1")
                CntrFreight20 += parseInt(item.Nos);
            if (item.CntrTypeID == "2")
                CntrFreight40 += parseInt(item.Nos);
        }

        if (CntrFreight20 != Cntr20) {
            gRow.Nos = "0";
            validation += "<span style='color:red;'>*</span> <span>Container Type and Freight Mamifest Container not equal</span></br>"
            Swal.fire(validation);
        }
        if (CntrFreight40 != Cntr40) {
            gRow.Nos = "0";
            validation += "<span style='color:red;'>*</span> <span>Container Type and Freight Mamifest Container not equal</span></br>"
            Swal.fire(validation);
        }


    }


    SlotCntrCheck(gRow) {
        var validation = "";
        var Cntr20 = 0;
        var Cntr40 = 0;

        var CntrFreight20 = 0;
        var CntrFreight40 = 0;

        for (let item of this.DynamicCntrNoGrid) {
            if (item.CntrTypeID == "1")
                Cntr20 += 1;
            if (item.CntrTypeID == "2")
                Cntr40 += 1;
        }
        for (let item of this.fillSlotDynamicgrid) {
            if (item.CntrTypeID == "1")
                CntrFreight20 += 1;
            if (item.CntrTypeID == "2")
                CntrFreight40 += 1;
        }

        if (CntrFreight20 != Cntr20) {
            gRow.CntrTypeID = "0";
            validation += "<span style='color:red;'>*</span> <span>Container Type and Slot Mamifest Container not equal</span></br>"
            Swal.fire(validation);
        }
        if (CntrFreight40 != Cntr40) {
            gRow.CntrTypeID = "0";
            validation += "<span style='color:red;'>*</span> <span>Container Type and slot Mamifest Container not equal</span></br>"
            Swal.fire(validation);
        }



    }


    SlotNosCheck(gRow) {


        var validation = "";
        var Cntr20 = 0;
        var Cntr40 = 0;

        var CntrFreight20 = 0;
        var CntrFreight40 = 0;

        for (let item of this.DynamicCntrNoGrid) {
            if (item.CntrTypeID == "1")
                Cntr20 += parseInt(item.Nos);
            if (item.CntrTypeID == "2")
                Cntr40 += parseInt(item.Nos);
        }
        for (let item of this.fillSlotDynamicgrid) {
            if (item.CntrTypeID == "1")
                CntrFreight20 += parseInt(item.Nos);
            if (item.CntrTypeID == "2")
                CntrFreight40 += parseInt(item.Nos);
        }

        if (CntrFreight20 != Cntr20) {
            gRow.Nos = "0";
            validation += "<span style='color:red;'>*</span> <span>Nos and Slot Mamifest Container not equal</span></br>"
            Swal.fire(validation);
        }
        if (CntrFreight40 != Cntr40) {
            gRow.Nos = "0";
            validation += "<span style='color:red;'>*</span> <span>Nos and slott Mamifest Container not equal</span></br>"
            Swal.fire(validation);
        }


    }


    ShipmentPODCntrCheck(gRow) {
        var validation = "";
        var Cntr20 = 0;
        var Cntr40 = 0;

        var CntrFreight20 = 0;
        var CntrFreight40 = 0;

        for (let item of this.DynamicCntrNoGrid) {
            if (item.CntrTypeID == "1")
                Cntr20 += 1;
            if (item.CntrTypeID == "2")
                Cntr40 += 1;
        }
        for (let item of this.DynamicShimpmentPODGrid) {
            if (item.CntrTypeID == 1)
                CntrFreight20 += 1;
            if (item.CntrTypeID == 2)
                CntrFreight40 += 1;
        }

        //if (CntrFreight20 != Cntr20) {
        //    gRow.CntrTypeID = 0;
        //    validation += "<span style='color:red;'>*</span> <span>Container Type and Shipment POD Container not equal</span></br>"
        //    Swal.fire(validation);
        //}
        //if (CntrFreight40 != Cntr40) {
        //    gRow.CntrTypeID = 0;
        //    validation += "<span style='color:red;'>*</span> <span>Container Type and  Shipment POD Container not equal</span></br>"
        //    Swal.fire(validation);
        //}



    }

    ShipmentPOLCntrCheck(id, i, gRow) {
        var validation = "";
        var Cntr20 = 0;
        var Cntr40 = 0;

        var CntrFreight20 = 0;
        var CntrFreight40 = 0;

        for (let item of this.DynamicCntrNoGrid) {
            if (item.CntrTypeID == "1")
                Cntr20 += 1;
            if (item.CntrTypeID == "2")
                Cntr40 += 1;
        }
        for (let item of this.DynamicShimpmentPOLGrid) {
            if (item.CntrTypeID == 1)
                CntrFreight20 += 1;
            if (item.CntrTypeID == 2)
                CntrFreight40 += 1;
        }

        //if (CntrFreight20 != Cntr20) {
        //    gRow.CntrTypeID = 0;
        //    validation += "<span style='color:red;'>*</span> <span>Container Type and Shipment POL Container not equal</span></br>"
        //    Swal.fire(validation);
        //}
        //if (CntrFreight40 != Cntr40) {
        //    gRow.CntrTypeID = 0;
        //    validation += "<span style='color:red;'>*</span> <span>Container Type and  Shipment POL Container not equal</span></br>"
        //    Swal.fire(validation);
        //}



    }


    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }

    onConfirm() {

        this.bookingservice.BookingStatusList(this.Formvalues.value).subscribe((data) => {

            if (data.length > 0) {
                if (data[0].AlertMegId == 1) {
                    this.Formvalues.get('BookingStatus').patchValue("CONFIRM");
                    this.showSave = true;
                    this.disableSave = true;
                    this.disableApprove = true;
                    this.showConfirm = true;
                    Swal.fire("Booking Confirm Successfully");
                }
                else if (data[0].AlertMegId == 2) {
                    Swal.fire(data[0].AlertMessage);
                }

            }


        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
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


    OnClickVoyageID(VesselID) {

        this.service.getVoyageList(VesselID).subscribe(data => {

            this.FillVoyageMaster = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    OnClickTSVoyageID(VesselID) {

        this.service.getVoyageList(VesselID).subscribe(data => {

            this.FillTSVoyageMaster = data;

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

        $('#CustomerID').select2("enable", false);

        $('#BookingCommissionID').select2("enable", false);
        $('#EnquirySourceID').select2("enable", false);
        $('#SalesPersonID').select2("enable", false);
        $('#OriginID').select2("enable", false);
        $('#LoadPortID').select2("enable", false);
        $('#DischargePortID').select2("enable", false);
        $('#DestinationID').select2("enable", false);
        $('#RouteID').select2("enable", false);
        $('#DeliveryTermsID').select2("enable", false);
        $('#CargoID').select2("enable", false);
        $("#CargoWeight").attr("disabled", "disabled");
        // $("#HSCode").attr("disabled", "disabled");
        $("#EnquiryDate").attr("disabled", "disabled");
        //$("#EnquiryNo").attr("disabled", "disabled");
        $('#CustomerContract').select2("enable", false);
        $('#LineContract').select2("enable", false);
        $('#ddlVesselID').select2("enable", false);
        $('#ddlVoyageID').select2("enable", false);
        $('#TranshipmentPortID').select2("enable", false);

        $('#TSVesselID').select2("enable", false);
        $('#TSVoyageID').select2("enable", false);

        $('#PrincibalID').select2("enable", false);

        $('#PODAgentID').select2("enable", false);
        $('#FPODAgentID').select2("enable", false);
        $('#TSAgentID').select2("enable", false);
        $('#TSTwoAgentID').select2("enable", false);
        $('#SlotOperatorID').select2("enable", false);
        $('#PayTermsID').select2("enable", false);
        $('#OfficeCode').select2("enable", false);
        //$('#NominationID').select2("enable", false);


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





    }
    ForsControlDisable() {

        $("#CustomerID").removeAttr('disabled');
        // $('#BookingCommissionID').removeAttr('disabled');
        // $('#EnquirySourceID').removeAttr('disabled');
        //$('#SalesPersonID').removeAttr('disabled');
        //$('#OriginID').removeAttr('disabled');
        //$('#LoadPortID').removeAttr('disabled');
        //$('#DischargePortID').removeAttr('disabled');
        //$('#DestinationID').removeAttr('disabled');
        // $('#RouteID').removeAttr('disabled');
        //  $('#DeliveryTermsID').removeAttr('disabled');
        $('#CargoID').removeAttr('disabled');
        $("#CargoWeight").removeAttr('disabled');
        //$("#HSCode").removeAttr('disabled');
        $("#EnquiryDate").removeAttr('disabled');
        //$("#EnquiryNo").removeAttr('disabled');
        $('#ddlVesselID').removeAttr('disabled');
        $('#ddlVoyageID').removeAttr('disabled');
        $('#TranshipmentPortID').removeAttr('disabled');

        $('#TSVesselID').removeAttr('disabled');
        $('#TSVoyageID').removeAttr('disabled');

        $('#PrincibalID').removeAttr('disabled');
        //  $('#CustomerContractID').removeAttr('disabled');
        //$('#LineContractID').removeAttr('disabled');

        $('#PODAgentID').removeAttr('disabled');
        $('#FPODAgentID').removeAttr('disabled');
        $('#TSAgentID').removeAttr('disabled');
        $('#TSTwoAgentID').removeAttr('disabled');
        $('#SlotOperatorID').removeAttr('disabled');
        $('#PayTermsID').removeAttr('disabled');
        $('#OfficeCode').removeAttr('disabled');
        $('#CustomerContract').removeAttr('disabled');
        $('#LineContract').removeAttr('disabled');
        //$('#NominationID').removeAttr('disabled');


        //if ($('#EnquirySourceID').val() == 1) {

        //    $("#SalesPersonID").removeAttr('disabled');

        //}
        //else {

        //    $("#NominationID").removeAttr('disabled');
        //}



    }


    OnClickCntrChageAllValues() {
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

        this.DynamicCntrNoGrid.splice(index, 1);
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

    //StandardOrgChange(value) {

    //    if (value == "1") {
    //        this.Formvalues.controls.NumberOfDays.setValue('');
    //        this.Formvalues.controls['NumberOfDays'].disable();

    //    }
    //    if (value == "2") {

    //        //this.Formvalues.controls.NumberOfDays.setValue('');
    //        this.Formvalues.controls['NumberOfDays'].enable();
    //    }
    //}

    //StandardDestination(value) {

    //    if (value == "1") {
    //        this.Formvalues.controls.NumberOfDaysDestin.setValue('');
    //        this.Formvalues.controls['NumberOfDaysDestin'].disable();

    //    }
    //    if (value == "2") {

    //        //this.Formvalues.controls.NumberOfDaysDestin.setValue('');
    //        this.Formvalues.controls['NumberOfDaysDestin'].enable();
    //    }
    //}

    //StandardDamageSchema(value) {

    //    if (value == "1") {
    //        this.Formvalues.controls.txtDamageScheme.setValue('');
    //        this.Formvalues.controls['txtDamageScheme'].disable();

    //    }
    //    if (value == "2") {

    //        // this.Formvalues.controls.txtDamageScheme.setValue('');
    //        this.Formvalues.controls['txtDamageScheme'].enable();
    //    }
    //}

    //StandardSecurityDeposit(value) {

    //    if (value == "1") {
    //        this.Formvalues.controls.txtSecurityDeposit.setValue('');
    //        this.Formvalues.controls['txtSecurityDeposit'].disable();

    //    }
    //    if (value == "2") {

    //        //this.Formvalues.controls.txtSecurityDeposit.setValue('');
    //        this.Formvalues.controls['txtSecurityDeposit'].enable();
    //    }
    //}

    //StandardBOLRequirment(value) {

    //    if (value == "1") {
    //        this.Formvalues.controls.txtBOLRequirement.setValue('');
    //        this.Formvalues.controls['txtBOLRequirement'].disable();

    //    }
    //    if (value == "2") {

    //        // this.Formvalues.controls.txtBOLRequirement.setValue('');
    //        this.Formvalues.controls['txtBOLRequirement'].enable();
    //    }
    //}


    OnclickeEdit() {

        if (this.Formvalues.value.BookingStatus == "CONFIRM") {
            Swal.fire("Edit not Allowed");
            return;
        } else {

            this.showSave = true;
            this.disableSave = false;
            this.ControlDisplay = false;
        }
        this.ForsControlDisable();
        this.ControlDisplay = true;
    }
}