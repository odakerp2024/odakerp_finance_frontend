import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomercontractService } from 'src/app/services/customercontract.service';
import { logdata } from '../../../model/logdata';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { element } from 'protractor';
import { InventoryService } from '../../../services/inventory.service';
import { Inventory } from '../../../model/Inventory';
import { PrincipaltariffService } from '../../../services/principaltariff.service';
import { CurrencyMaster } from '../../../model/common';
import { PorttariffService } from '../../../services/porttariff.service';
declare let $: any;
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { MyCustomerDropdown } from 'src/app/model/Admin';
import { Input } from '@angular/core';
import { EnquiryService } from '../../../services/enquiry.service';
import { LogdetailsService } from '../../../services/logdetails.service';
import { Agency, CustomerMaster, DynamicGridAttach, DynamicGridContainer, Port, RateRequest, RouteMaster, SalesPersonMaster } from 'src/app/model/CustomerContract';

@Component({
    selector: 'app-customercontract',
    templateUrl: './customercontract.component.html',
    styleUrls: ['./customercontract.component.css']
})
export class CustomercontractComponent implements OnInit {
    CreatedOn: string = '';
    CreatedBy: string = '';
    ModifiedOn: string = '';
    ModifiedBy: string = '';


    cancelreason: string = '';
    rejectreason: string = '';
    cancelreasonvalue: string = '';
    rejectreasonvalue: string = '';
    statusvalues: Status[] = [
        { value: '1', viewValue: 'Open' },
        { value: '2', viewValue: 'Confirmed' },
        { value: '3', viewValue: 'Lost' },
        { value: '4', viewValue: 'Cancel' }
    ];
    StdSplvalues: StdSpl[] = [
        { value: '1', viewValue: 'SPL' },
        { value: '2', viewValue: 'STD' },
    ];
    CopyID = 0;
    value = 0;
    CCID = 0;
    myControl = new FormControl('');
    contractForm: FormGroup;
    ddlCustomerItem: CustomerMaster[];
    ddlPrincipalItem: Agency[];
    ddlOriginItem: Port[];
    ddlLoadPortItem: Port[];
    ddlDischargePortItem: Port[];
    ddlDestinationItem: Port[];
    ddlRouteItem: RouteMaster[];
    ddlTermsItem: RouteMaster[];
    ddlSalesPersonItem: SalesPersonMaster[];
    ddlContainerItem: Inventory[];
    ddlCurrencyItem: CurrencyMaster[];
    ddlCargoItem: RouteMaster[];
    ddlRRItem: RateRequest[];
    ddlCancelItem: RouteMaster[];
    ddlRejectItem: RouteMaster[];
    OfficeMasterAllvalues: MyCustomerDropdown[];
    HDArrayIndex = '';
    newDynamicContainer: any = {};
    TIDValue = '';
    CID = null;
    val: any = {};
    AID = null;
    dynamicContainerArray: Array<DynamicGridContainer> = [];
    DynamicGridAttachLink: Array<DynamicGridAttach> = [];
    public showSave: boolean = true;
    public showApprove: boolean = true;
    public showReject: boolean = true;
    public showCancel: boolean = true;
    public showCancelReason: boolean = true;
    public showRejectReason: boolean = true;
    public showEdit: boolean = true;
    disableSave = false;
    disableApprove = false;
    disableCancel = false;
    disableReject = false;
    public ControlDisplay: boolean = false;


    constructor(private router: Router, private route: ActivatedRoute, private EnqService: EnquiryService, private service: CustomercontractService, private IS: InventoryService, private ps: PorttariffService, private fb: FormBuilder, private ES: EncrDecrServiceService, private LS: LogdetailsService) {
        this.route.queryParams.subscribe(params => {

            this.contractForm = this.fb.group({
                ID: params['id'],

            });

        });

    }
    getToday(): string {
        return new Date().toISOString().split('T')[0]

    }

    ngOnInit() {

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
        this.createForm();
        this.onInitalBinding();

        this.newDynamicContainer = { CID: 0, ContainerTypeID: 0, Nos: '', CargoTypeID: 0, OceanAmount: '', OceanCurrencyID: 0, SlotAmount: '', PODStdID: 0, PODAmount: '' };
        this.dynamicContainerArray.push(this.newDynamicContainer);
        $('#ddlRateReqNo').on('select2:select', (e, args) => {
            this.RateReqChanged($("#ddlRateReqNo").val());
        });



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
                this.contractForm = this.fb.group({
                    ID: queryString["ID"].toString(),

                });
                this.CCID = queryString["ID"].toString();
                this.CopyID = queryStringCopy["CopyID"];
                if (this.CopyID != 1) {
                    this.ForsControlEnable();
                }
                this.CreateExistingForm();
                this.onInitalBinding();

            }

        });

    }
    RateReqChanged(countryval) {

        this.contractForm.value.RRID = countryval;

        this.service.getExRRValues(this.contractForm.value).subscribe(data => {
            this.contractForm.patchValue(data[0]);
            $('#ddlRateReqNo').select2().val(data[0].RRID);
            $('#ddlPrincipal').select2().val(data[0].PrincipalID);
            $('#ddlSalesPerson').select2().val(data[0].SalesPersonID);
            $('#ddlOrigin').select2().val(data[0].OriginID);
            $('#ddlLoadPort').select2().val(data[0].LoadPortID);
            $('#ddlDischargePort').select2().val(data[0].DischargePortID);
            $('#ddlDestination').select2().val(data[0].DestinationID);
            $('#ddlRoute').select2().val(data[0].RouteID);
            $('#ddlTerms').select2().val(data[0].DeliveryTermsID);
            $('#ddlOfficeLocation').select2().val(data[0].OfficeLocation);
            this.contractForm.get('ContractDate').patchValue(this.formatDate(new Date()));
            $('#ddlStatusv').val("1");



        });

        this.service.getExRRContValues(this.contractForm.value).subscribe((data1 => {
            this.dynamicContainerArray.splice(0, 1);
            for (let i = 0; i < data1.length; i++) {
                this.dynamicContainerArray.push({
                    'CID': 0,
                    'ContainerTypeID': data1[i].ContainerTypeID,
                    'Nos': data1[i].Nos,
                    'CargoTypeID': data1[i].CargoTypeID,
                    'OceanAmount': data1[i].OceanAmount,
                    'OceanCurrencyID': data1[i].OceanCurrencyID,
                    'SlotAmount': data1[i].SlotAmount,
                    //'SlotCurrencyID': data1[i].SlotCurrencyID,
                    //'POLStdID': data1[i].POLStdID,
                    //'POLAmount': data1[i].POLAmount,
                    //'POLCurrencyID': data1[i].POLCurrencyID,
                    'PODStdID': data1[i].PODStdID,
                    'PODAmount': data1[i].PODAmount,
                    /*'PODCurrencyID': data1[i].PODCurrencyID,*/

                });
            }
        }));

    }
    onInitalBinding() {
        this.OnBindDropdownCustomer();
        this.OnBindDropdownPrincipal();
        this.OnBindDropdownOrigin();
        this.OnBindDropdownDischargePort();
        this.OnBindDropdownLoadPort();
        this.OnBindDropdownDestination();
        this.OnBindDropdownRoute();
        this.OnBindDropdownDeliveryTerms();
        this.OnBindDropdownSalesPerson();
        this.OnBindDropdownCntrType();
        this.OnBindDropdownCurrency();
        this.OnBindDropdownCargoType();
        this.OnBindDropdownReqno();
        this.OnBindDropdownCancalReason();
        this.OnBindDropdownRejectReason();
        this.OnBindDropdownOfficeLocation();
    }
    OnBindDropdownOfficeLocation() {
        this.EnqService.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    OnBindDropdownCustomer() {
        this.service.getCustomerMaster(this.contractForm.value).subscribe(data => {
            this.ddlCustomerItem = data;
        });
    }


    OnBindDropdownPrincipal() {
        this.service.getPrincipalMaster(this.contractForm.value).subscribe(data => {
            this.ddlPrincipalItem = data;
        });
    }
    OnBindDropdownOrigin() {
        this.service.getOrignMaster().subscribe(data => {
            this.ddlOriginItem = data;
        });
    }
    OnBindDropdownDischargePort() {
        this.service.getDischargePort().subscribe(data => {
            this.ddlLoadPortItem = data;
        });
    }
    OnBindDropdownLoadPort() {
        this.service.getLoadPort().subscribe(data => {
            this.ddlDischargePortItem = data;
        });
    }
    OnBindDropdownDestination() {
        this.service.getDestination().subscribe(data => {
            this.ddlDestinationItem = data;
        });
    }
    OnBindDropdownRoute() {
        this.service.getRouteMaster(this.contractForm.value).subscribe(data => {
            this.ddlRouteItem = data;
        });
    }
    OnBindDropdownDeliveryTerms() {
        this.service.getDeliveryTermsMaster(this.contractForm.value).subscribe(data => {
            this.ddlTermsItem = data;
        });
    }
    OnBindDropdownSalesPerson() {
        this.service.getSalesPersonMaster(this.contractForm.value).subscribe(data => {
            this.ddlSalesPersonItem = data;
        });
    }
    OnBindDropdownCntrType() {
        this.IS.CntrTypeDropdown(this.contractForm.value).subscribe(data => {
            this.ddlContainerItem = data;
        });
    }
    OnBindDropdownCurrency() {
        this.ps.getCurrencyList().subscribe(data => {
            this.ddlCurrencyItem = data;
        });
    }
    OnBindDropdownCargoType() {
        this.service.getCargoMaster(this.contractForm.value).subscribe(data => {
            this.ddlCargoItem = data;
        });
    }
    OnBindDropdownReqno() {
        this.service.getRRNo(this.contractForm.value).subscribe(data => {
            this.ddlRRItem = data;
        });
    }

    OnBindDropdownCancalReason() {
        this.service.getCancelReason(this.contractForm.value).subscribe(data => {
            this.ddlCancelItem = data;
        });
    }
    OnBindDropdownRejectReason() {
        this.service.getRejectReason(this.contractForm.value).subscribe(data => {
            this.ddlRejectItem = data;
        });
    }

    StandardOrgChange(value) {

        if (value == "1") {

            this.contractForm.controls.FreeDaysOrigin.setValue('');
            this.contractForm.controls['FreeDaysOrigin'].disable();
        }
        if (value == "2") {
            this.contractForm.controls.FreeDaysOrigin.setValue('');
            this.contractForm.controls['FreeDaysOrigin'].enable();
        }
    }
    StandardDestChange(value) {

        if (value == "1") {

            this.contractForm.controls.FreeDaysDestination.setValue('');
            this.contractForm.controls['FreeDaysDestination'].disable();
        }
        if (value == "2") {
            this.contractForm.controls.FreeDaysDestination.setValue('');
            this.contractForm.controls['FreeDaysDestination'].enable();

        }
    }
    StandardDamChange(value) {

        if (value == "1") {
            this.contractForm.controls.DamageScheme.setValue('');
            this.contractForm.controls['DamageScheme'].disable();
        }
        if (value == "2") {
            this.contractForm.controls.DamageScheme.setValue('');
            this.contractForm.controls['DamageScheme'].enable();
        }
    }

    StandardDepChange(value) {

        if (value == "1") {
            this.contractForm.controls.SecDeposit.setValue('');
            this.contractForm.controls['SecDeposit'].disable();

        }
        if (value == "2") {
            this.contractForm.controls.SecDeposit.setValue('');
            this.contractForm.controls['SecDeposit'].enable();

        }
    }

    StandardBOLReqChange(value) {

        if (value == "1") {
            this.contractForm.controls.BOLReq.setValue('');
            this.contractForm.controls['BOLReq'].disable();

        }
        if (value == "2") {
            this.contractForm.controls.BOLReq.setValue('');
            this.contractForm.controls['BOLReq'].enable();

        }
    }
    createForm() {

        this.contractForm = this.fb.group({
            ID: 0,
            CustomerID: 0,
            PrincipalID: 0,
            ContractNo: '',
            ContractDate: '',
            SalesPersonID: 0,
            ValidTill: '',
            OriginID: 0,
            LoadPortID: 0,
            DischargePortID: 0,
            DestinationID: 0,
            RouteID: 0,
            DeliveryTermsID: 0,
            Status: 1,
            Remarks: '',
            FreeDaysOrigin: '',
            FreeDaysOriginType: 1,
            FreeDaysDestination: '',
            FreeDaysDestinationType: 1,
            DamageScheme: '',
            DamageSchemeType: 1,
            SecDeposit: '',
            SecDepositType: 1,
            BOLReq: '',
            BOLReqType: 1,
            RRID: 0,
            Reason: '',
            CancelReasonID: 0,
            RejectReason: '',
            RejectReasonID: 0,
            OfficeLocation: 0,
            PageName: '',
            SeqNo: 0,
            LogInID: 0,
            UserID: '',

        });
        this.showSave = true;
        this.showApprove = false;
        this.showReject = false;
        this.showCancel = false;
        this.showCancelReason = false;
        this.showRejectReason = false;
        this.showEdit = false;
        this.contractForm.get('ContractDate').patchValue(this.formatDate(new Date()));
        this.StandardOrgChange(1);
        this.StandardDestChange(1);
        this.StandardDamChange(1);
        this.StandardDepChange(1);
        this.StandardBOLReqChange(1);
        $('#ddlStatusv').val("1");


    }

    CreateExistingForm() {
        //ActionLog
        this.contractForm.value.LogInID = this.contractForm.value.ID;
        this.contractForm.value.SeqNo = 1;
        this.contractForm.value.PageName = "CustomerContract";
        this.LS.getLogDetails(this.contractForm.value).subscribe(data => {

            if (data.length > 0) {
                this.CreatedOn = data[0].Date;
                this.CreatedBy = data[0].UserName;
            }
            else {
                this.CreatedOn = "NA";
                this.CreatedBy = "NA";
            }

        });

        this.contractForm.value.LogInID = this.contractForm.value.ID;
        this.contractForm.value.SeqNo = 2;
        this.contractForm.value.PageName = "CustomerContract";
        this.LS.getLogDetails(this.contractForm.value).subscribe(data => {

            this.ModifiedOn = data[0].Date;
            this.ModifiedBy = data[0].UserName;
        });
        if (this.CCID != 0) {

            this.service.getCustomerContractEdit(this.contractForm.value).pipe(
            ).subscribe(data => {

                this.contractForm.patchValue(data[0]);
                if (this.CopyID == 1) {

                    this.contractForm.get('ID').patchValue(0);
                    this.contractForm.get('ContractNo').patchValue('');
                    this.contractForm.get('ValidTill').patchValue(this.formatDate(new Date().toISOString().slice(0, 10)));
                    this.contractForm.get('ContractDate').patchValue(this.formatDate(new Date().toISOString().slice(0, 10)));
                    this.contractForm.get('Status').patchValue(1);
                    $('#ddlStatusv').select2().val(1);
                    this.showSave = true;
                    this.showApprove = false;
                    this.showReject = false;
                    this.showCancel = false;
                    this.showEdit = false;
                    /* this.ForsControlDisable();*/


                }
                $('#ddlCustomer').select2().val(data[0].CustomerID);
                $('#ddlPrincipal').select2().val(data[0].PrincipalID);
                $('#ddlSalesPerson').select2().val(data[0].SalesPersonID);
                $('#ddlOrigin').select2().val(data[0].OriginID);
                $('#ddlLoadPort').select2().val(data[0].LoadPortID);
                $('#ddlDischargePort').select2().val(data[0].DischargePortID);
                $('#ddlDestination').select2().val(data[0].DestinationID);
                $('#ddlRoute').select2().val(data[0].RouteID);
                $('#ddlTerms').select2().val(data[0].DeliveryTermsID);
               /* $('#ddlStatusv').select2().val(data[0].Status);*/
                $('#ddlRateReqNo').select2().val(data[0].RRID);
                $('#ddlOfficeLocation').select2().val(data[0].OfficeLocation);
                this.cancelreason = data[0].Reason;
                this.rejectreason = data[0].RejectReason;
                this.cancelreasonvalue = data[0].CancelReasonValue;
                this.rejectreasonvalue = data[0].RejectReasonValue;


                if (this.CopyID != 1) {

                    if (data[0].Status == 1) {
                        this.showEdit = true;
                        this.showSave = true;
                        this.showApprove = true;
                        this.showReject = true;
                        this.showCancel = true;
                        this.showCancelReason = false;
                        this.showRejectReason = false;

                        this.disableSave = true;
                        this.disableApprove = true;
                        this.disableReject = true;
                        this.disableCancel = true;


                    }


                    if (data[0].Status == 2) {
                        this.showSave = false;
                        this.showApprove = false;
                        this.showReject = false;
                        this.showCancel = false;
                        this.showCancelReason = false;
                        this.showRejectReason = false;
                        this.showEdit = true;

                    }
                    if (data[0].Status == 3) {

                        this.showSave = false;
                        this.showApprove = false;
                        this.showReject = false;
                        this.showCancel = false;
                        this.showCancelReason = false;
                        this.showRejectReason = true;
                        this.showEdit = false;

                    }
                    if (data[0].Status == 4) {
                        this.showSave = false;
                        this.showApprove = false;
                        this.showReject = false;
                        this.showCancel = false;
                        this.showCancelReason = true;
                        this.showRejectReason = false;
                        this.showEdit = false;

                    }
                }

            });

            this.service.getContainerMasterDtlsEdit(this.contractForm.value).subscribe((data1 => {
                //this.dynamicContainerArray.splice(0, 1);
                for (let i = 0; i < data1.length; i++) {

                    this.dynamicContainerArray.length = 0;
                    if (data1.length > 0) {

                        this.dynamicContainerArray.push({
                            'CID': data1[i].CID,
                            'ContainerTypeID': data1[i].ContainerTypeID,
                            'Nos': data1[i].Nos,
                            'CargoTypeID': data1[i].CargoTypeID,
                            'OceanAmount': data1[i].OceanAmount,
                            'OceanCurrencyID': data1[i].OceanCurrencyID,
                            'SlotAmount': data1[i].SlotAmount,

                            'PODStdID': data1[i].PODStdID,
                            'PODAmount': data1[i].PODAmount,

                        });


                    }
                    else {

                        this.newDynamicContainer = { CID: '', ContainerTypeID: 0, Nos: '', CargoTypeID: 0, OceanAmount: '', OceanCurrencyID: 0, SlotAmount: '', PODStdID: 0, PODAmount: '' };
                        this.dynamicContainerArray.push(this.newDynamicContainer);
                    }
                }
            }));

            this.service.AttachmentView(this.contractForm.value).subscribe((data) => {
                if (data.length > 0) {
                    this.DynamicGridAttachLink.length = 0;
                    for (let item of data) {
                        this.DynamicGridAttachLink.push({
                            'AID': item.AID,
                            'AttachName': item.AttachName,
                            'AttachFile': item.AttachFile,

                        })
                    }
                }

            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });
          

            this.contractForm = this.fb.group({
                ID: 0,
                CustomerID: 0,
                PrincipalID: 0,
                ContractNo: '',
                ContractDate: '',
                SalesPersonID: 0,
                ValidTill: '',
                OriginID: 0,
                LoadPortID: 0,
                DischargePortID: 0,
                DestinationID: 0,
                RouteID: 0,
                DeliveryTermsID: 0,
                Status: 0,
                Remarks: '',
                FreeDaysOrigin: '',
                FreeDaysOriginType: 0,
                FreeDaysDestination: '',
                FreeDaysDestinationType: 0,
                DamageScheme: '',
                DamageSchemeType: 0,
                SecDeposit: '',
                SecDepositType: 0,
                BOLReq: '',
                BOLReqType: 0,
                RRID: 0,
                Reason: '',
                CancelReasonID: 0,
                RejectReason: '',
                RejectReasonID: 0,
                OfficeLocation: 0
            });
            this.StandardOrgChange(1);
            this.StandardDestChange(1);
            this.StandardDamChange(1);
            this.StandardDepChange(1);
            this.StandardBOLReqChange(1);
        }
        else {

            this.contractForm = this.fb.group({
                ID: 0,
                CustomerID: 0,
                PrincipalID: 0,
                ContractNo: '',
                ContractDate: '',
                SalesPersonID: 0,
                ValidTill: '',
                OriginID: 0,
                LoadPortID: 0,
                DischargePortID: 0,
                DestinationID: 0,
                RouteID: 0,
                DeliveryTermsID: 0,
                Status: 1,
                Remarks: '',
                FreeDaysOrigin: '',
                FreeDaysOriginType: 1,
                FreeDaysDestination: '',
                FreeDaysDestinationType: 1,
                DamageScheme: '',
                DamageSchemeType: 1,
                SecDeposit: '',
                SecDepositType: 1,
                BOLReq: '',
                BOLReqType: 1,
                RRID: 0,
                Reason: '',
                CancelReasonID: 0,
                RejectReason: '',
                RejectReasonID: 0,
                OfficeLocation: 0
            });
            this.showSave = true;
            this.showApprove = false;
            this.showReject = false;
            this.showCancel = false;
            this.showCancelReason = false;
            this.showRejectReason = false;

            this.contractForm.get('ContractDate').patchValue(this.formatDate(new Date()));
            this.StandardOrgChange(1);
            this.StandardDestChange(1);
            this.StandardDamChange(1);
            this.StandardDepChange(1);
            this.StandardBOLReqChange(1);
            $('#ddlStatusv').val("1");
        }
    }
    deleteRow(dynamicContainerArray, index, CID) {

        if (this.dynamicContainerArray.length == 1) {
            Swal.fire("Can't delete first row")
            return false;
        } else {
            this.dynamicContainerArray.splice(index, 1);
            this.contractForm.value.CID = CID;
            this.service.ContainerDelete(this.contractForm.value).subscribe(Data => {
                Swal.fire("Deleted Successfully", 'Warning')
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
            return true;
        }
    }
    onSubmit() {


        var validation = "";

        if ($('#ddlCustomer').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Customer</span></br>"
        }
        //if ($('#ddlPrincipal').val() == null) {
        //    validation += "<span style='color:red;'>*</span> <span>Please Select Principal</span></br>"
        //}
        if ($('#ddlOrigin').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Origin</span></br>"
        }
        if ($('#ddlLoadPort').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Locad Port</span></br>"
        }
        if ($('#ddlDischargePort').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Discharge Port</span></br>"
        }
        if ($('#ddlDestination').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Destination</span></br>"
        }

        if ($('#ddlRoute').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Route</span></br>"
        }
        if ($('#ddlTerms').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select DeliveryTerms</span></br>"
        }
        if ($('#ddlOfficeLocation').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Office Location</span></br>"
        }

        if (this.contractForm.value.ContractDate == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Pick Contract Date</span></br>"
        }
        if ($('#ddlValidTill').val() == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Pick Valid Till</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        if ($('#ddlCustomer').val() != "") {
            this.contractForm.value.CustomerID = $('#ddlCustomer').val();
        }
        else {
            this.contractForm.value.CustomerID = 0;
        }
        if ($('#ddlPrincipal').val() != "") {
            this.contractForm.value.PrincipalID = $('#ddlPrincipal').val();
        }
        else {
            this.contractForm.value.PrincipalID = 0;
        }
        if ($('#ddlSalesPerson').val() != "") {
            this.contractForm.value.SalesPersonID = $('#ddlSalesPerson').val();
        }
        else {
            this.contractForm.value.SalesPersonID = 0;
        }

        if ($('#ddlOrigin').val() != "") {
            this.contractForm.value.OriginID = $('#ddlOrigin').val();
        }
        else {
            this.contractForm.value.OriginID = 0;
        }

        if ($('#ddlLoadPort').val() != "") {
            this.contractForm.value.LoadPortID = $('#ddlLoadPort').val();
        }
        else {
            this.contractForm.value.LoadPortID = 0;
        }
        if ($('#ddlDischargePort').val() != "") {
            this.contractForm.value.DischargePortID = $('#ddlDischargePort').val();
        }
        else {
            this.contractForm.value.DischargePortID = 0;
        }
        if ($('#ddlDischargePort').val() != "") {
            this.contractForm.value.DischargePortID = $('#ddlDischargePort').val();
        }
        else {
            this.contractForm.value.DischargePortID = 0;
        }

        if ($('#ddlDestination').val() != "") {
            this.contractForm.value.DestinationID = $('#ddlDestination').val();
        }
        else {
            this.contractForm.value.DestinationID = 0;
        }
        if ($('#ddlDestination').val() != "") {
            this.contractForm.value.DestinationID = $('#ddlDestination').val();
        }
        else {
            this.contractForm.value.DestinationID = 0;
        }
        if ($('#ddlRoute').val() != "") {
            this.contractForm.value.RouteID = $('#ddlRoute').val();
        }
        else {
            this.contractForm.value.RouteID = 0;
        }

        if ($('#ddlTerms').val() != "") {
            this.contractForm.value.DeliveryTermsID = $('#ddlTerms').val();
        }
        else {
            this.contractForm.value.DeliveryTermsID = 0;
        }


        if ($('#ddlTerms').val() != "") {
            this.contractForm.value.DeliveryTermsID = $('#ddlTerms').val();
        }
        else {
            this.contractForm.value.DeliveryTermsID = 0;
        }
        if ($('#ddlContractDate').val() != "") {
            this.contractForm.value.ContractDate = $('#ddlContractDate').val();
        }
        else {
            this.contractForm.value.ContractDate = 0;
        }
        if ($('#ddlValidTill').val() != "") {
            this.contractForm.value.ValidTill = $('#ddlValidTill').val();
        }
        else {
            this.contractForm.value.ValidTill = 0;
        }

        if ($('#ddlOfficeLocation').val() != "") {
            this.contractForm.value.OfficeLocation = $('#ddlOfficeLocation').val();
        }
        else {
            this.contractForm.value.OfficeLocation = 0;
        }


        if ($("#ddlStatusv").val() == null) {
            this.contractForm.value.Status = 0;
        }
        else {
            this.contractForm.value.Status = $('#ddlStatusv').val();
        }
        if ($('#ddlRateReqNo').val() == null) {
            this.contractForm.value.RRID = 0;
        }
        else {
            this.contractForm.value.RRID = $('#ddlRateReqNo').val();
        }
        if ($('#txtFreeDaysOrigin').val() == null) {
            this.contractForm.value.FreeDaysOrigin = "";
        }
        else {
            this.contractForm.value.FreeDaysOrigin = $('#txtFreeDaysOrigin').val();
        }

        if ($('#txtFreeDaysDestination').val() == null) {
            this.contractForm.value.FreeDaysDestination = "";
        }
        else {
            this.contractForm.value.FreeDaysDestination = $('#txtFreeDaysDestination').val();
        }

        if ($('#txtDamageScheme').val() == null) {
            this.contractForm.value.DamageScheme = "";
        }
        else {
            this.contractForm.value.DamageScheme = $('#txtDamageScheme').val();
        }
        if ($('#txtSecDeposit').val() == null) {
            this.contractForm.value.SecDeposit = "";
        }
        else {
            this.contractForm.value.SecDeposit = $('#txtSecDeposit').val();
        }
        if ($('#txtBOLReq').val() == null) {
            this.contractForm.value.BOLReq = "";
        }
        else {
            this.contractForm.value.BOLReq = $('#txtBOLReq').val();
        }
        this.contractForm.value.SessionFinYear = "2022";

        //
        this.contractForm.value.SeqNo = 0;
        this.contractForm.value.PageName = "CustomerContract";
        this.contractForm.value.UserID = localStorage.getItem("UserID");
        //
        var ItemsSchedule = [];
        var ItemsAttach = [];
        for (let item of this.dynamicContainerArray) {

            var intCID = item.CID;
            if (typeof item.CID == "undefined") {
                intCID = 0;
            }
            //ItemsSchedule.push('Insert:' + intCID, item.ContainerTypeID, item.Nos, item.CargoTypeID, item.OceanAmount, item.OceanCurrencyID,
            //    item.SlotAmount, item.SlotCurrencyID, item.POLStdID, item.POLAmount, item.POLCurrencyID, item.PODStdID, item.PODAmount, item.PODCurrencyID
            //);
            ItemsSchedule.push('Insert:' + intCID, item.ContainerTypeID, item.Nos, item.CargoTypeID, item.OceanAmount, item.OceanCurrencyID, item.SlotAmount, item.PODStdID, item.PODAmount

            );
        }
        this.contractForm.value.Itemsv = ItemsSchedule.toString();

        for (let item of this.DynamicGridAttachLink) {
            var AIDv = 0;
            if (item.AttachName != "") {
                if (typeof item.AID == "undefined")
                    AIDv = 0;
                else
                    AIDv = item.AID;

                ItemsAttach.push('Insert:' + AIDv, item.AttachName, item.AttachFile
                );
            }
        }
        this.contractForm.value.ItemsAttach = ItemsAttach.toString();

        this.service.saveContract(this.contractForm.value).subscribe(data => {

            this.contractForm.value.LogInID = data[0].ID;
            if (this.CCID == 0)
                this.contractForm.value.SeqNo = 1;
            else
                this.contractForm.value.SeqNo = 2;
            this.contractForm.value.PageName = "CustomerContract";
            this.contractForm.value.UserID = localStorage.getItem("UserID");
            this.LS.LogDataInsert(this.contractForm.value).subscribe(data => {

            });

            Swal.fire("Record Saved Successfully");
            setTimeout(() => {
                this.router.navigate(['/views/enquiries-booking/customercontract/customercontractview/customercontractview']);
            }, 2000);  //5s
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    OnClickAddValue(dynamic, index) {
        var validation = "";
        if (dynamic.Nos == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Nos</span></br>"
        }
        if (dynamic.CargoTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Cargo Type</span></br>"
        }
        if (dynamic.ContainerTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Container Type</span></br>"
        }

        if (dynamic.OceanCurrencyID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Currency</span></br>"
        }
        if (dynamic.OceanAmount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Freight Amount</span></br>"
        }
        if (dynamic.SlotAmount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Slot Amount</span></br>"
        }
        if (dynamic.PODStdID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Std/Spl</span></br>"
        }
        if (dynamic.PODAmount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter POD Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }




        this.newDynamicContainer = {
            ContainerTypeID: 0,
            Nos: '',
            CargoTypeID: 0,
            OceanAmount: '',
            OceanCurrencyID: 0,
            SlotAmount: '',
            /*SlotCurrencyID: 0,*/
            //POLStdID: 0,
            //POLAmount: '',
            //POLCurrencyID: 0,
            PODStdID: 0,
            PODAmount: '',
            /*PODCurrencyID : 0*/
        };
        this.dynamicContainerArray.push(this.newDynamicContainer);
        return true;
    }

    onApprove() {
        this.contractForm.value.Status = 2;
        this.showSave = false;
        this.showApprove = false;
        this.showReject = false;
        this.showCancel = false;

        this.service.updateApproveStatus(this.contractForm.value).subscribe(data => {
            Swal.fire("Confirmed Successfully");
            setTimeout(() => {
                this.router.navigate(['/views/enquiries-booking/customercontract/customercontractview/customercontractview']);
            }, 2000);  //5s
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }
    OnRejectModal() {
        $('#RejectReason').modal('show');
    }
    OnCancelModal() {
        $('#CancelReason').modal('show');
    }
    onReject() {
        this.contractForm.value.Status = 3;

        //if (this.contractForm.value.Status != "1") {
        //    this.showReject = true;
        //    this.showSave = true;
        //    this.showApprove = true;
        //    this.showCancel = true;
        //}
        //else {
        //    this.showReject = false;
        //    this.showSave = false;
        //    this.showApprove = false;
        //    this.showCancel = false;
        //}



        //var validation = "";

        //if (this.contractForm.value.Reason == null) {
        //    validation += "<span style='color:red;'>*</span> <span>Please Enter Reason</span></br>"
        //}


        //if (validation != "") {

        //    Swal.fire(validation)
        //    return false;
        //}
        this.contractForm.value.RejectReasonID = $('#ddlReject').val();

        this.service.updateRejectStatus(this.contractForm.value).subscribe(data => {

            Swal.fire({
                title: 'Lost Successfully',
                showDenyButton: false,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.router.navigate(['/views/enquiries-booking/customercontract/customercontractview/customercontractview']);
                }
            });

            $('#RejectReason').modal('hide');
           
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    onCancel() {
        this.contractForm.value.Status = 4;

        //if (this.contractForm.value.Status != "1") {
        //    this.showReject = true;
        //    this.showSave = true;
        //    this.showApprove = true;
        //    this.showCancel = true;
        //}
        //else {
        //    this.showReject = false;
        //    this.showSave = false;
        //    this.showApprove = false;
        //    this.showCancel = false;
        //}
        //var validation = "";

        //if (this.contractForm.value.Reason == null) {
        //    validation += "<span style='color:red;'>*</span> <span>Please Enter Reason</span></br>"
        //}


        //if (validation != "") {

        //    Swal.fire(validation)
        //    return false;
        //}
        this.contractForm.value.CancelReasonID = $('#ddlCancel').val();
        this.service.updateCancelStatus(this.contractForm.value).subscribe(data => {

           
            Swal.fire({
                title: 'Cancelled Successfully',
                showDenyButton: false,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.router.navigate(['/views/enquiries-booking/customercontract/customercontractview/customercontractview']);
                }
            });
            $('#CancelReason').modal('hide');
           
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
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
            AttachFile: this.uploadedfile,
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

    RemoveAttach(DynamicGridAttachLink, index, AID) {

        this.contractForm.value.AID = AID;
        this.DynamicGridAttachLink.splice(index, 1);
        this.service.AttachDelete(this.contractForm.value).subscribe(Data => {
            Swal.fire("Attachment Removed Successfully");
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    selectedFile: File = null;
    uploadedfile: string = null;
    progress: string = '';

    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
        const filedata = new FormData();
        filedata.append('file', this.selectedFile, this.selectedFile.name)
        this.service.AttachUpload(this.selectedFile).subscribe(
            (event) => {

                var fullpath = event;
                var res = JSON.stringify(fullpath).split('\\').pop().split('"}')[0]
                this.uploadedfile = res;
                // console.log(this.uploadedfile);

            }
        );

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

    ForsControlEnable() {

        $('#ddlCustomer').select2("enable", false);
        $("#ddlOfficeLocation").attr("disabled", "disabled");
        $("#ddlContractDate").attr("disabled", "disabled");
        $('#ddlPrincipal').select2("enable", false);
        $("#ddlSalesPerson").select2("enable", false);
        $("#ddlValidTill").attr("disabled", "disabled");
        $('#ddlRateReqNo').select2("enable", false);
        $('#ddlOrigin').select2("enable", false);
        $('#ddlLoadPort').select2("enable", false);
        $('#ddlDischargePort').select2("enable", false);
        $('#ddlDestination').select2("enable", false);
        $('#ddlRoute').select2("enable", false);
        $('#ddlTerms').select2("enable", false);




        $("#txtFreeDaysOrigin").attr("disabled", "disabled");
        $("#txtFreeDaysDestination").attr("disabled", "disabled");
        $("#txtDamageScheme").attr("disabled", "disabled");
        $("#txtSecDeposit").attr("disabled", "disabled");
        $("#txtBOLReq").attr("disabled", "disabled");
        $("#txtRemarks").attr("disabled", "disabled");

        $('#OriginChk1').prop("disabled", "disabled");
        $('#OriginChk2').prop("disabled", "disabled");

        $('#DestChk1').prop("disabled", "disabled");
        $('#DestChk2').prop("disabled", "disabled");

        $('#DamChk1').prop("disabled", "disabled");
        $('#DamChk2').prop("disabled", "disabled");

        $('#DepChk1').prop("disabled", "disabled");
        $('#DepChk2').prop("disabled", "disabled");

        $('#BOLChk1').prop("disabled", "disabled");
        $('#BOLChk2').prop("disabled", "disabled");



        this.disableSave = true;
        this.disableApprove = true;
        this.disableReject = true;
        this.disableCancel = true;
        this.ControlDisplay = true;


    }



    ForsControlDisable() {

        $("#ddlCustomer").removeAttr('disabled');
        $("#ddlOfficeLocation").removeAttr('disabled');
        $("#ddlContractDate").removeAttr("disabled");
        $("#ddlPrincipal").removeAttr('disabled');
        $("#ddlSalesPerson").removeAttr('disabled');
        $("#ddlValidTill").removeAttr('disabled');
        $("#ValidTillDate").removeAttr("disabled");
        $("#ddlRateReqNo").removeAttr("disabled");
        $("#ddlOrigin").removeAttr('disabled');
        $('#ddlLoadPort').removeAttr('disabled');
        $('#ddlDischargePort').removeAttr('disabled');
        $('#ddlDestination').removeAttr('disabled');
        $('#ddlRoute').removeAttr('disabled');
        $('#ddlTerms').removeAttr('disabled');

        //$('#txtFreeDaysOrigin').removeAttr('disabled');
        //$('#txtFreeDaysDestination').removeAttr('disabled');
        //$('#txtDamageScheme').removeAttr('disabled');
        //$('#txtSecDeposit').removeAttr('disabled');
        //$('#txtBOLReq').removeAttr('disabled');

        $('#txtRemarks').removeAttr('disabled');
        $("#ddlSalesPerson").removeAttr('disabled');
        $('#OriginChk1').removeAttr('disabled');
        $('#OriginChk2').removeAttr('disabled');

        $('#DestChk1').removeAttr("disabled", "disabled");
        $('#DestChk2').removeAttr("disabled", "disabled");

        $('#DamChk1').removeAttr("disabled", "disabled");
        $('#DamChk2').removeAttr("disabled", "disabled");

        $('#DepChk1').removeAttr("disabled", "disabled");
        $('#DepChk2').removeAttr("disabled", "disabled");

        $('#BOLChk1').removeAttr("disabled", "disabled");
        $('#BOLChk2').removeAttr("disabled", "disabled");

        //this.StandardOrgChange(1);
        //this.StandardDestChange(1);
        //this.StandardDamChange(1);
        //this.StandardDepChange(1);
        //this.StandardBOLReqChange(1);

        var FreeDayOriginvx = this.contractForm.value.FreeDaysOriginType
        if (FreeDayOriginvx == 2) {
            $("#txtFreeDaysOrigin").removeAttr("disabled");

        }

        var FreeDayDestinationx = this.contractForm.value.FreeDaysDestinationType
        if (FreeDayDestinationx == 2) {
            $("#txtFreeDaysDestination").removeAttr("disabled");

        }
        var DamageSchemex = this.contractForm.value.DamageSchemeType
        if (DamageSchemex == 2) {
            $("#txtDamageScheme").removeAttr("disabled");

        }
        var SecurityDepositx = this.contractForm.value.SecDepositType
        if (SecurityDepositx == 2) {
            $("#txtSecDeposit").removeAttr("disabled");

        }
        var BOLRequirementx = this.contractForm.value.BOLReqType
        if (BOLRequirementx == 2) {
            $("#txtBOLReq").removeAttr("disabled");

        }

        if ($("#ddlStatusv").val() == 1) {
            this.disableSave = false;
            this.disableApprove = false;
            this.disableReject = false;
            this.disableCancel = false;
        }
        if ($("#ddlStatusv").val() == 2) {
            this.disableSave = true;
            this.disableApprove = true;
            this.disableReject = true;
            this.disableCancel = true;
        }
        if ($("#ddlStatusv").val() == 3) {
            this.disableSave = true;
            this.disableApprove = true;
            this.disableReject = true;
            this.disableCancel = true;
        }
        if ($("#ddlStatusv").val() == 4) {
            this.disableSave = true;
            this.disableApprove = true;
            this.disableReject = true;
            this.disableCancel = true;
        }

        this.ControlDisplay = false;
        var FreeDayOriginvx = this.contractForm.value.FreeDayOrigin
        if (FreeDayOriginvx == 2) {
            $("#NumberOfDays").removeAttr("disabled");

        }

        //var FreeDayDestinationx = this.contractForm.value.FreeDayDestination
        //if (FreeDayDestinationx == 2) {
        //    $("#NumberOfDaysDestin").removeAttr("disabled");

        //}
        //var DamageSchemex = this.contractForm.value.DamageScheme
        //if (DamageSchemex == 2) {
        //    $("#txtDamageScheme").removeAttr("disabled");

        //}
        //var SecurityDepositx = this.contractForm.value.SecurityDeposit
        //if (SecurityDepositx == 2) {
        //    $("#txtSecurityDeposit").removeAttr("disabled");

        //}
        //var BOLRequirementx = this.contractForm.value.BOLRequirement
        //if (BOLRequirementx == 2) {
        //    $("#txtBOLRequirement").removeAttr("disabled");

        //}

    }

    OnclickeEdit() {
        if ($("#ddlStatusv").val() == 2) {
            Swal.fire("Edit Not Allowed For Approved Contract");
            return;
        }

        this.ForsControlDisable();

    }

}
interface Status {
    value: string;
    viewValue: string;
}
interface StdSpl {
    value: string;
    viewValue: string;
}

