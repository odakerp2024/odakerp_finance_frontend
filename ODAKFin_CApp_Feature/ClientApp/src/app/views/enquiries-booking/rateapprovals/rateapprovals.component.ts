import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { City, Country, CurrencyMaster, Port } from '../../../model/common';
import { CntrTypeDetailsCharges, MyRateApproval, CommonValues, DynamicGridAttach, CommonValue } from '../../../model/RateApproval';
import { MastersService } from '../../../services/masters.service';
import { RateapprovalService } from '../../../services/rateapproval.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { MyCustomerDropdown, MyPortdrodown } from '../../../model/Admin';
import { PorttariffService } from '../../../services/porttariff.service';
import { InventoryService } from '../../../services/inventory.service';
import { Inventory } from '../../../model/Inventory';
import { EncrDecrServiceService } from '../../../services/encr-decr-service.service';
import { EnquiryService } from '../../../services/enquiry.service';
import { LogdetailsService } from '../../../services/logdetails.service';
import { logdata } from '../../../model/logdata';
declare let $: any;

@Component({
    selector: 'app-rateapprovals',
    templateUrl: './rateapprovals.component.html',
    styleUrls: ['./rateapprovals.component.css']
})
export class RateapprovalsComponent implements OnInit {
    statusvalues: Status[] = [
        { value: '1', viewValue: 'OPEN' },
        { value: '2', viewValue: 'CONFIRMED' },
        { value: '3', viewValue: 'LOST' },
        { value: '4', viewValue: 'CANCELLED' },
    ];
    val: any = {};
    //StdSplvalues: StatusSPL[] = [
    //    { value: '1', viewValue: 'STD' },
    //    { value: '2', viewValue: 'SPL' },
    //];
    CreatedOn: string = '';
    CreatedBy: string = '';
    ModifiedOn: string = '';
    ModifiedBy: string = '';
    Reason: string = '';
    CancelRemarks: string = '';
    RRID = 0;
    CopyID = 0;
    HDArrayIndex = '';
    disableStdSplAmt: boolean[] = [];
    disableTextbox = false;
    rateForm: FormGroup;
    dsPrincipleTypes: MyRateApproval[];
    dsRouteTypes: MyRateApproval[];
    dsPorts: Port[];
    dsDeliveryTerms: MyRateApproval[];
    dsSalesperson: MyRateApproval[];
    dsEnquiry: MyRateApproval[];
    fillCurrency: CurrencyMaster[];
    dsCntrType: Inventory[];
    dsCargoTypes: MyRateApproval[];
    OfficeMasterAllvalues: MyCustomerDropdown[];
    AID = null;
    DsCntrTypeDetailsCharges: Array<CntrTypeDetailsCharges> = [];
    newDsCntrTypeDetailsCharges: any = {};
    StdSplvalues: CommonValues[];
    public showSave: boolean = true;
    public showApprove: boolean = true;
    public showReject: boolean = true;
    public showCancel: boolean = true;
    public showRemarks: boolean = true;
    public showCancelReason: boolean = true;
    public showRejectReason: boolean = true;
    public ControlDisplay: boolean = false;
    disableSave = false;
    disableApprove = false;
    disableCancel = false;
    disableReject = false;
    public showEdit: boolean = true;
    ddlRejectItem: CommonValue[];
    ddlCancelItem: CommonValue[];
    DynamicGridAttachLink: Array<DynamicGridAttach> = [];
    constructor(private router: Router, private route: ActivatedRoute, private service: OrgService, private ms: MastersService, private rs: RateapprovalService, private fb: FormBuilder, private http: HttpClient, private ps: PorttariffService, private IS: InventoryService, private ES: EncrDecrServiceService, private es: EnquiryService, private LS: LogdetailsService) {
        this.route.queryParams.subscribe(params => {

            this.rateForm = this.fb.group({
                ID: params['id'],

            });

        });
    }
    getToday(): string {
        return new Date().toISOString().split('T')[0]

    }

    getBack(): string {
        return new Date().toISOString().split('T')[0]
    }
    ngOnInit() {

        this.newDsCntrTypeDetailsCharges = { PID: 0, CntrTypeID: 0, Nos: '', CargoTypeID: 0, FrtCurrID: 0, FrieghtAmount: '', SlotAmount: '', StdSplVID: 0, StdSplVAmount: '' };

        this.DsCntrTypeDetailsCharges.push(this.newDsCntrTypeDetailsCharges);

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
        //this.createForm();
        this.createForm();
        this.onInitalBinding();

        $('#ddlEnquiryNo').on('select2:select', (e, args) => {
            this.EnquiryChanged($("#ddlEnquiryNo").val());
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


            this.RRID = queryString["ID"].toString();


            if (queryString["ID"] != null) {

                this.rateForm = this.fb.group({
                    ID: queryString["ID"].toString(),

                });
                this.CopyID = queryStringCopy["CopyID"];
                if (this.CopyID != 1) {
                    this.ForsControlEnable();
                }
                this.createExitingForm();
                this.onInitalBinding();
            }


        });
    }

    EnquiryChanged(EnquiryID) {

        this.rateForm.value.EnquiryID = EnquiryID;
        this.rs.getExistEnquiryDetailsBind(this.rateForm.value).subscribe(data => {
            this.rateForm.patchValue(data[0]);
            $('#ddlPrinciple').select2().val(data[0].PrincipleID);
            $('#ddlSalesperson').select2().val(data[0].SalesPersonID);
            $('#ddlOrigin').select2().val(data[0].OriginID);
            $('#ddlLoadPort').select2().val(data[0].LoadPortID);
            $('#ddlDischargePort').select2().val(data[0].DischargePortID);
            $('#ddlDestination').select2().val(data[0].DestinationID);
            $('#ddlRouteType').select2().val(data[0].RouteTypeID);
            $('#ddlDeliveryTerm').select2().val(data[0].DeliveryTermID);
            $('#ddlEnquiryNo').select2().val(data[0].EnquiryID);
            this.rateForm.get('RequestDate').patchValue(this.formatDate(new Date()));
            $('#ddlStatus').val("1");
            this.StandardOrgChange(data[0].FreeDaysOrigin);
            this.StandardDestChange(data[0].FreeDaysDest);
            this.DamageSchemeChange(data[0].DamageScheme);
            this.SecurityDepositChange(data[0].SecurityDeposit);
            this.BOLReqChange(data[0].BOLReq);
            $('#txtFreedaysOrg').val(data[0].FreeDaysOrgValue);
            $('#txtFreedaysDest').val(data[0].FreeDaysDestValue);
            $('#txtDamageScheme').val(data[0].DamageSchemeValue);
            $('#txtSecurityDeposit').val(data[0].SecurityDepositDesc);
            $('#txtBOLReq').val(data[0].BOLReqDesc);
        });
        this.rs.getExistEnquiryChargesEdit(this.rateForm.value).subscribe((data) => {

            if (data.length > 0) {
                this.DsCntrTypeDetailsCharges.length = 0;
                for (let item of data) {
                    this.DsCntrTypeDetailsCharges.push({
                        'PID': 0,
                        'CntrTypeID': item.CntrTypeID,
                        'Nos': item.Nos,
                        'CargoTypeID': item.CargoTypeID,
                        'FrieghtAmount': item.FrieghtAmount,
                        'FrtCurrID': item.FrtCurrID,
                        'SlotAmount': item.SlotAmount,
                        // 'SlotCurrID': item.SlotCurrID,
                        // 'StdSplID': item.StdSplID,
                        //  'StdSplAmount': item.StdSplAmount,
                        // 'StdSplCurrID': item.StdSplCurrID,
                        'StdSplVID': item.StdSplVID,
                        'StdSplVAmount': item.StdSplVAmount,
                        // 'StdSplVCurrID': item.StdSplVCurrID,
                    })
                }
            }
            else {

                this.DsCntrTypeDetailsCharges.length = 0;
                this.newDsCntrTypeDetailsCharges = { PID: 0, CntrTypeID: 0, Nos: '', CargoTypeID: 0, FrtCurrID: 0, FrieghtAmount: '', SlotAmount: '', StdSplVID: 1, StdSplVAmount: '' };

                for (let i = 0; i < this.newDsCntrTypeDetailsCharges.length; i++) {
                    //this.disableStdSplAmt[i] = false;
                    //this.StdSplChanged(1,i)
                }
                this.DsCntrTypeDetailsCharges.push(this.newDsCntrTypeDetailsCharges);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    onInitalBinding() {
        this.StdSplvalues = [
            { ID: '1', Desc: 'STD' },
            { ID: '2', Desc: 'SPL' },
        ];
        this.OnBindPrinciples();
        this.OnBindPorts();
        this.OnBindRouteTypes();
        this.OnBindDeliveryTerms();
        this.OnBindSalesPerson();
        this.OnBindEnquirylist();
        this.OnBindCurrency();
        this.OnBindDropdownCntrType();
        this.OnBindDropdowndsCargoTypes();
        this.OnBindRejectDropdown();
        this.OnBindCancelDropdown();
        this.OnBindOfficeDropdown();
    }
    OnBindOfficeDropdown() {
        this.es.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    OnBindRejectDropdown() {
        this.rs.getRejectDDBind(this.rateForm.value).subscribe(data => {
            this.ddlRejectItem = data;
        });
    }
    OnBindCancelDropdown() {
        this.rs.getCancelDDBind(this.rateForm.value).subscribe(data => {
            this.ddlCancelItem = data;
        });
    }
    OnBindPrinciples() {
        this.rs.getPrincipleBind(this.rateForm.value).subscribe(data => {
            this.dsPrincipleTypes = data;
        });
    }
    OnBindCurrency() {
        this.ps.getCurrencyList().subscribe(data => {
            this.fillCurrency = data;
        });
    }
    OnBindDropdownCntrType() {
        this.IS.CntrTypeDropdown(this.rateForm.value).subscribe(data => {
            this.dsCntrType = data;
        });
    }
    OnBindDropdowndsCargoTypes() {
        this.rs.getCargoTypes(this.rateForm.value).subscribe(data => {
            this.dsCargoTypes = data;
        });
    }

    OnBindPorts() {
        this.rs.getPortMasterBind(this.rateForm.value).subscribe(data => {
            this.dsPorts = data;
        });
    }
    OnBindRouteTypes() {
        this.rs.getRouteTypesBind(this.rateForm.value).subscribe(data => {
            this.dsRouteTypes = data;
        });
    }
    OnBindDeliveryTerms() {
        this.rs.getDeliveryTermsBind(this.rateForm.value).subscribe(data => {
            this.dsDeliveryTerms = data;
        });
    }
    OnBindSalesPerson() {
        this.rs.getSalesPersonBind(this.rateForm.value).subscribe(data => {
            this.dsSalesperson = data;
        });
    }
    OnBindEnquirylist() {
        this.rs.getEnquirylistBind(this.rateForm.value).subscribe(data => {
            this.dsEnquiry = data;
        });
    }
    createExitingForm() {
        //ActionLog
        this.rateForm.value.LogInID = this.rateForm.value.ID;
        this.rateForm.value.SeqNo = 1;
        this.rateForm.value.PageName = "RateApproval";
        this.LS.getLogDetails(this.rateForm.value).subscribe(data => {

            if (data.length > 0) {
                this.CreatedOn = data[0].Date;
                this.CreatedBy = data[0].UserName;
            }
            else {
                this.CreatedOn = "NA";
                this.CreatedBy = "NA";
            }

        });

        this.rateForm.value.LogInID = this.rateForm.value.ID;
        this.rateForm.value.SeqNo = 2;
        this.rateForm.value.PageName = "RateApproval";
        this.LS.getLogDetails(this.rateForm.value).subscribe(data => {

            this.ModifiedOn = data[0].Date;
            this.ModifiedBy = data[0].UserName;
        });
        if (this.RRID != 0) {

            this.rs.getRateApprovalEdit(this.rateForm.value).subscribe(data => {
                this.rateForm.patchValue(data[0]);
                if (this.CopyID == 1) {
                    this.rateForm.get('ID').patchValue(0);
                    this.rateForm.get('RequestNo').patchValue('');
                    this.rateForm.get('RequestDate').patchValue(this.formatDate(new Date()));
                    this.rateForm.get('ValidTill').patchValue(this.formatDate(new Date()));
                    this.rateForm.get('StatusID').patchValue(1);
                    $('#ddlStatus').select2().val(1);
                    $('#ddlOffice').select2("enable", false);
                    this.showSave = true;
                    this.showApprove = false;
                    this.showReject = false;
                    this.showCancel = false;
                    this.showRemarks = false;
                    this.showEdit = false;
                    this.ForsControlDisable();
                }
                this.StandardOrgChange(data[0].FreeDaysOrigin);
                this.StandardDestChange(data[0].FreeDaysDest);
                this.DamageSchemeChange(data[0].DamageScheme);
                this.SecurityDepositChange(data[0].SecurityDeposit);
                this.BOLReqChange(data[0].BOLReq);
                $('#ddlPrinciple').select2().val(data[0].PrincipleID);
                $('#ddlEnquiryNo').select2().val(data[0].EnquiryID);
                $('#ddlSalesperson').select2().val(data[0].SalesPersonID);
                $('#ddlOffice').select2().val(data[0].OfficeLocID);
                $('#ddlOrigin').select2().val(data[0].OriginID);
                $('#ddlLoadPort').select2().val(data[0].LoadPortID);
                $('#ddlDischargePort').select2().val(data[0].DischargePortID);
                $('#ddlDestination').select2().val(data[0].DestinationID);
                $('#ddlRouteType').select2().val(data[0].RouteTypeID);
                $('#ddlDeliveryTerm').select2().val(data[0].DeliveryTermID);
                $('#txtFreedaysOrg').val(data[0].FreeDaysOrgValue);
                $('#txtFreedaysDest').val(data[0].FreeDaysDestValue);
                $('#txtDamageScheme').val(data[0].DamageSchemeValue);
                $('#txtSecurityDeposit').val(data[0].SecurityDepositDesc);
                $('#txtBOLReq').val(data[0].BOLReqDesc);

                this.Reason = data[0].Reason;
                this.CancelRemarks = data[0].CancelRemarks
                if (this.CopyID != 1) {
                    if (data[0].StatusID == 2) {
                        this.showSave = false;
                        this.showApprove = false;
                        this.showReject = false;
                        this.showCancel = false;
                        this.showRemarks = false;
                        this.showEdit = false;

                    }
                    if (data[0].StatusID == 3) {
                        this.showSave = false;
                        this.showApprove = false;
                        this.showReject = false;
                        this.showCancel = false;
                        this.showRemarks = true;
                        this.showEdit = false;
                        this.showRejectReason = true;

                    }
                    if (data[0].StatusID == 1) {
                        this.showSave = true;
                        this.showApprove = true;
                        this.showReject = true;
                        this.showCancel = true;
                        this.showRemarks = true;
                        this.showEdit = true;
                        this.disableSave = true;
                        this.disableApprove = true;
                        this.disableReject = true;
                        this.disableCancel = true;

                    }
                    if (data[0].StatusID == 4) {
                        this.showSave = false;
                        this.showApprove = false;
                        this.showReject = false;
                        this.showCancel = false;
                        this.showRemarks = true;
                        this.showEdit = false;
                        this.showCancelReason = true;
                    }
                }

                /*this.ForsControlDsableSTDSPL(data[0].FreeDaysOrigin, data[0].FreeDaysDest, data[0].DamageScheme, data[0].SecurityDeposit, data[0].BOLReq);*/
            });

            this.rs.getRRChargesEdit(this.rateForm.value).subscribe((data) => {

                if (data.length > 0) {

                    this.DsCntrTypeDetailsCharges.length = 0;
                    for (let item of data) {
                        this.DsCntrTypeDetailsCharges.push({
                            'PID': item.PID,
                            'CntrTypeID': item.CntrTypeID,
                            'Nos': item.Nos,
                            'CargoTypeID': item.CargoTypeID,
                            'FrieghtAmount': item.FrieghtAmount,
                            'FrtCurrID': item.FrtCurrID,
                            'SlotAmount': item.SlotAmount,
                            // 'SlotCurrID': item.SlotCurrID,
                            // 'StdSplID': item.StdSplID,
                            //  'StdSplAmount': item.StdSplAmount,
                            // 'StdSplCurrID': item.StdSplCurrID,
                            'StdSplVID': item.StdSplVID,
                            'StdSplVAmount': item.StdSplVAmount,
                            // 'StdSplVCurrID': item.StdSplVCurrID,
                        })
                    }
                }
                else {

                    this.newDsCntrTypeDetailsCharges = { PID: 0, CntrTypeID: 0, Nos: '', CargoTypeID: 0, FrtCurrID: 0, FrieghtAmount: '', SlotAmount: '', StdSplVID: 1, StdSplVAmount: '' };

                    //for (let i = 0; i < this.newDsCntrTypeDetailsCharges.length; i++) {
                    //    this.disableStdSplAmt[i] = false;
                    //    //this.StdSplChanged(1,i)
                    //}
                    this.DsCntrTypeDetailsCharges.push(this.newDsCntrTypeDetailsCharges);
                }
            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });

            this.rs.getRRAttachmentsView(this.rateForm.value).subscribe((data) => {
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

           

            this.rateForm = this.fb.group({
                ID: 0,
                PrincipleID: 0,
                RequestDate: '',
                RequestNo: '',
                EnquiryID: 0,
                SalesPersonID: 0,
                ValidTill: 0,
                DischargePortID: 0,
                OriginID: 0,
                LoadPortID: 0,
                DestinationID: 0,
                DeliveryTermID: 0,
                RouteTypeID: 0,
                StatusID: 0,
                Remarks: '',
                FreeDaysOrigin: 0,
                FreeDaysOrgValue: '',
                FreeDaysDest: 0,
                FreeDaysDestValue: '',
                DamageScheme: 0,
                DamageSchemeValue: '',
                SecurityDeposit: 0,
                SecurityDepositDesc: '',
                BOLReq: 0,
                BOLReqDesc: '',
                CancelRemarks: '',
                RejectRemarks: '',
                RejectReasonID: 0,
                CancelReasonID: 0,
                OfficeLocID: 0,
            });


        }
        else {
            this.rateForm = this.fb.group({
                ID: 0,
                PrincipleID: 0,
                RequestDate: '',
                RequestNo: '',
                EnquiryID: 0,
                SalesPersonID: 0,
                ValidTill: 0,
                DischargePortID: 0,
                OriginID: 0,
                LoadPortID: 0,
                DestinationID: 0,
                DeliveryTermID: 0,
                RouteTypeID: 0,
                StatusID: 1,
                Remarks: '',
                FreeDaysOrigin: 1,
                FreeDaysOrgValue: '',
                FreeDaysDest: 1,
                FreeDaysDestValue: '',
                DamageScheme: 1,
                DamageSchemeValue: '',
                SecurityDeposit: 1,
                SecurityDepositDesc: '',
                BOLReq: 1,
                BOLReqDesc: '',
                CancelRemarks: '',
            });
            this.showSave = true;
            this.showApprove = false;
            this.showReject = false;
            this.showCancel = false;
            this.showRemarks = false;
            $('#ddlStatus').val("1");
            this.rateForm.get('RequestDate').patchValue(this.formatDate(new Date()));
            this.StandardOrgChange(1);
            this.StandardDestChange(1);
            this.DamageSchemeChange(1);
            this.SecurityDepositChange(1);
            this.BOLReqChange(1);
        }
    }
    createForm() {
       
            //ActionLog
        this.rateForm = this.fb.group({
            ID: 0,
            PrincipleID: 0,
            RequestDate: '',
            RequestNo: '',
            EnquiryID: 0,
            SalesPersonID: 0,
            ValidTill: 0,
            DischargePortID: 0,
            OriginID: 0,
            LoadPortID: 0,
            DestinationID: 0,
            DeliveryTermID: 0,
            RouteTypeID: 0,
            StatusID: 1,
            Remarks: '',
            FreeDaysOrigin: 1,
            FreeDaysOrgValue: '',
            FreeDaysDest: 1,
            FreeDaysDestValue: '',
            DamageScheme: 1,
            DamageSchemeValue: '',
            SecurityDeposit: 1,
            SecurityDepositDesc: '',
            BOLReq: 1,
            BOLReqDesc: '',
            CancelRemarks: '',
            RejectRemarks: '',
            RejectReasonID: 0,
            CancelReasonID: 0,
            OfficeLocID: 0,
        });
        this.showSave = true;
        this.showApprove = false;
        this.showReject = false;
        this.showCancel = false;
        this.showRemarks = false;
        this.showEdit = false;
        this.showRejectReason = false;
        this.showCancelReason = false;
        $('#ddlStatus').val("1");
        this.rateForm.get('RequestDate').patchValue(this.formatDate(new Date()));
        this.StandardOrgChange(1);
        this.StandardDestChange(1);
        this.DamageSchemeChange(1);
        this.SecurityDepositChange(1);
        this.BOLReqChange(1);

    }
    btnAddCntrTypeCharges(gRow, i) {

        var validation = "";
        if (gRow.CntrTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Container Type</span></br>"
        }
        if (gRow.Nos == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Nos</span></br>"
        }
        if (gRow.CargoTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Cargo Type</span></br>"
        }

        if (gRow.FrtCurrID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select  Currency</span></br>"
        }
        if (gRow.FrieghtAmount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Frieght Amount</span></br>"
        }
        if (gRow.SlotAmount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter SlotAmount</span></br>"
        }

        if (gRow.StdSplVID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Std/Spl</span></br>"
        }
        if (gRow.StdSplVID == "2" && gRow.StdSplVAmount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter  Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        this.newDsCntrTypeDetailsCharges = { PID: 0, CntrTypeID: 0, Nos: '', CargoTypeID: 0, FrtCurrID: 0, FrieghtAmount: '', SlotAmount: '', StdSplVID: 0, StdSplVAmount: '' };

        this.DsCntrTypeDetailsCharges.push(this.newDsCntrTypeDetailsCharges);
    }

    StandardOrgChange(value) {

        if (value == "1") {
            //this.rateForm.controls.FreeDaysOrgValue.setValue(14);
            /*  this.rateForm.controls.FreeDaysOrgValue.setValue('');*/
            this.rateForm.controls['FreeDaysOrgValue'].disable();

        }
        if (value == "2") {

            //this.rateForm.controls.FreeDaysOrgValue.setValue('');
            this.rateForm.controls['FreeDaysOrgValue'].enable();
        }
    }
    StandardDestChange(value) {

        if (value == "1") {
            //this.rateForm.controls.FreeDaysDestValue.setValue('');
            this.rateForm.controls['FreeDaysDestValue'].disable();
        }
        if (value == "2") {
            // this.rateForm.controls.FreeDaysDestValue.setValue('');
            this.rateForm.controls['FreeDaysDestValue'].enable();
        }
    }
    DamageSchemeChange(value) {

        if (value == "1") {
            // this.rateForm.controls.DamageSchemeValue.setValue('');
            this.rateForm.controls['DamageSchemeValue'].disable();
        }
        if (value == "2") {
            // this.rateForm.controls.DamageSchemeValue.setValue('');
            this.rateForm.controls['DamageSchemeValue'].enable();
        }
    }
    SecurityDepositChange(value) {

        if (value == "1") {
            //this.rateForm.controls.SecurityDepositDesc.setValue('');
            this.rateForm.controls['SecurityDepositDesc'].disable();
        }
        if (value == "2") {
            //this.rateForm.controls.SecurityDepositDesc.setValue('');
            this.rateForm.controls['SecurityDepositDesc'].enable();
        }
    }
    BOLReqChange(value) {
        if (value == "1") {
            //this.rateForm.controls.BOLReqDesc.setValue('');
            this.rateForm.controls['BOLReqDesc'].disable();
        }
        if (value == "2") {
            //this.rateForm.controls.BOLReqDesc.setValue('');
            this.rateForm.controls['BOLReqDesc'].enable();
        }
    }


    StandardOrgExistChange(value, text) {

        if (value == "1") {
            this.rateForm.controls.FreeDaysOrgValue.setValue(text);
            this.rateForm.controls['FreeDaysOrgValue'].disable();

        }
        if (value == "2") {
            this.rateForm.controls.FreeDaysOrgValue.setValue(text);
            this.rateForm.controls['FreeDaysOrgValue'].enable();
        }
    }


    onSubmit() {

        var validation = "";

        if ($("#ddlPrinciple").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Principle</span></br>"
        }
        if (this.rateForm.value.RequestDate == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Request Date</span></br>"
        }
        if ($("#ddlOffice").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Office</span></br>"
        }
        if ($("#ddlSalesperson").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select SalesPerson No</span></br>"
        }

        if (this.rateForm.value.ValidTill == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Valid Till Date</span></br>"
        }
        //if (this.rateForm.value.RequestDate == this.rateForm.value.ValidTill) {
        //    validation += "<span style='color:red;'>*</span> <span>Please RequestDate and Valid Till Date not be Same</span></br>"
        //}
        if ($("#ddlOrigin").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Origin No</span></br>"
        }
        if ($("#ddlLoadPort").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Load Port</span></br>"
        }
        if ($("#ddlDischargePort").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Discharge Port</span></br>"
        }
        if ($("#ddlDestination").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Destination</span></br>"
        }
        if ($("#ddlRouteType").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Route Type</span></br>"
        }
        if ($("#ddlDeliveryTerm").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select DeliveryTerms </span></br>"
        }
        if ($("#ddlStatus").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Status</span></br>"
        }
        for (let item of this.DsCntrTypeDetailsCharges) {
            if (item.CntrTypeID == 0 || item.Nos == "" || item.CargoTypeID == 0 || item.FrieghtAmount == ""
                || item.FrtCurrID == 0 || item.SlotAmount == "" || item.StdSplVID == 0
            ) {
                validation += "Please Enter Shipment Details Container Values</br>";
            }
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        this.rateForm.value.FreeDaysOrgValue = $('#ddlPrinciple').val();
        if ($("#ddlPrinciple").val() == null) {
            this.rateForm.value.PrincipleID = 0;
        }
        else {
            this.rateForm.value.PrincipleID = $('#ddlPrinciple').val();
        }

        if ($("#ddlEnquiryNo").val() == null) {
            this.rateForm.value.EnquiryID = 0;
        }
        else {
            this.rateForm.value.EnquiryID = $('#ddlEnquiryNo').val();
        }
        if ($("#ddlSalesperson").val() == null) {
            this.rateForm.value.SalesPersonID = 0;
        }
        else {
            this.rateForm.value.SalesPersonID = $('#ddlSalesperson').val();
        }
        if ($("#ddlOrigin").val() == null) {
            this.rateForm.value.OriginID = 0;
        }
        else {
            this.rateForm.value.OriginID = $('#ddlOrigin').val();
        }
        if ($("#ddlLoadPort").val() == null) {
            this.rateForm.value.LoadPortID = 0;
        }
        else {
            this.rateForm.value.LoadPortID = $('#ddlLoadPort').val();
        }
        if ($("#ddlDischargePort").val() == null) {
            this.rateForm.value.DischargePortID = 0;
        }
        else {
            this.rateForm.value.DischargePortID = $('#ddlLoadPort').val();
        }
        if ($("#ddlDestination").val() == null) {
            this.rateForm.value.DestinationID = 0;
        }
        else {
            this.rateForm.value.DestinationID = $('#ddlDestination').val();
        }
        if ($("#ddlRouteType").val() == null) {
            this.rateForm.value.RouteTypeID = 0;
        }
        else {
            this.rateForm.value.RouteTypeID = $('#ddlRouteType').val();
        }
        if ($("#ddlDeliveryTerm").val() == null) {
            this.rateForm.value.DeliveryTermID = 0;
        }
        else {
            this.rateForm.value.DeliveryTermID = $('#ddlDeliveryTerm').val();
        }
        if ($("#ddlOffice").val() == null) {
            this.rateForm.value.OfficeLocID = 0;
        }
        else {
            this.rateForm.value.OfficeLocID = $('#ddlOffice').val();
        }
        if ($("#ddlStatus").val() == null) {
            this.rateForm.value.StatusID = 0;
        }
        else {
            this.rateForm.value.StatusID = $('#ddlStatus').val();
        }
        this.rateForm.value.FreeDaysOrgValue = $('#txtFreedaysOrg').val();
        this.rateForm.value.FreeDaysDestValue = $('#txtFreedaysDest').val();
        this.rateForm.value.DamageSchemeValue = $('#txtDamageScheme').val();
        this.rateForm.value.SecurityDepositDesc = $('#txtSecurityDeposit').val();
        this.rateForm.value.BOLReqDesc = $('#txtBOLReq').val();
        this.rateForm.value.SessionFinYear = "2022";

        var Items = [];
        var ItemsAttach = [];
        for (let item of this.DsCntrTypeDetailsCharges) {
            var PIDv = 0;
            var stdamt = "0.00";
            if (item.FrieghtAmount != "") {
                if (typeof item.PID == "undefined")
                    PIDv = 0;
                else
                    PIDv = item.PID;
                if (item.StdSplVAmount != "") {
                    stdamt = item.StdSplVAmount;
                }

                Items.push('Insert:' + PIDv, item.CntrTypeID, item.Nos, item.CargoTypeID, item.FrtCurrID, item.FrieghtAmount, item.SlotAmount, item.StdSplVID, stdamt
                );
            }
        }
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
        this.rateForm.value.Items = Items.toString();
        this.rateForm.value.ItemsAttach = ItemsAttach.toString();

        this.rs.RateApprovalSave(this.rateForm.value).subscribe(Data => {

            this.rateForm.value.LogInID = Data[0].ID;
            if (this.RRID == 0)
                this.rateForm.value.SeqNo = 1;
            else
                this.rateForm.value.SeqNo = 2;
            this.rateForm.value.PageName = "RateApproval";
            this.rateForm.value.UserID = localStorage.getItem("UserID");
            this.LS.LogDataInsert(this.rateForm.value).subscribe(data => {

            });

            Swal.fire(Data[0].AlertMessage)
            setTimeout(() => {
                this.router.navigate(['/views/enquiries-booking/rateapprovals/rateapprovalsview/rateapprovalsview']);
            }, 2000);  //5s
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });

        
    }

    onReject() {
        $('#RejectReason').modal('show');
    }
    onCancel() {
        $('#CancelReason').modal('show');
    }
    onApprove() {

        this.rs.SubmitRateApproval(this.rateForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
            setTimeout(() => {
                this.router.navigate(['/views/enquiries-booking/rateapprovals/rateapprovalsview/rateapprovalsview']);
            }, 2000);  //5s
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }
    onRejectSave() {

        var validation = "";
        if (this.rateForm.value.RejectRemarks == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Reject Remarks</span></br>"
        }
        if ($("#ddlReject").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Reject Reason/span></br>"
        }
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        this.rateForm.value.RejectReasonID = $('#ddlReject').val();
        this.rs.RejectRateApproval(this.rateForm.value).subscribe(Data => {
            Swal.fire({
                title: Data[0].AlertMessage,
                showDenyButton: false,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.router.navigate(['/views/enquiries-booking/rateapprovals/rateapprovalsview/rateapprovalsview']);
                }
            });
            $('#RejectReason').modal('hide');
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }
    onCancelSave() {

        var validation = "";
        if (this.rateForm.value.CancelRemarks == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Cancel Remarks</span></br>"
        }
        if ($("#ddlCancel").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Cancel Reason/span></br>"
        }
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        this.rateForm.value.CancelReasonID = $('#ddlCancel').val();
        this.rs.onCancelRateApproval(this.rateForm.value).subscribe(Data => {
            Swal.fire({
                title: Data[0].AlertMessage,
                showDenyButton: false,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.router.navigate(['/views/enquiries-booking/rateapprovals/rateapprovalsview/rateapprovalsview']);
                }
            });
            $('#CancelReason').modal('hide');
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    ForsControlEnable() {

        $('#ddlPrinciple').select2("enable", false);
        $("#txtRequestDate").attr("disabled", "disabled");
        $('#ddlEnquiryNo').select2("enable", false);
        $('#ddlSalesperson').select2("enable", false);
        $("#txtValidTill").attr("disabled", "disabled");
        $('#ddlOrigin').select2("enable", false);
        $('#ddlLoadPort').select2("enable", false);
        $('#ddlDischargePort').select2("enable", false);
        $('#ddlDestination').select2("enable", false);
        $('#ddlRouteType').select2("enable", false);
        $('#ddlDeliveryTerm').select2("enable", false);
        $('#ddlOffice').select2("enable", false);
        $('#Remarks').attr("disabled", "disabled");

        $('#txtSecurityDeposit').attr("disabled", "disabled");
        $('#txtBOLReq').attr("disabled", "disabled");
        $('#txtDamageScheme').attr("disabled", "disabled");
        $('#txtFreedaysDest').attr("disabled", "disabled");
        $('#txtFreedaysOrg').attr("disabled", "disabled");

        $('#BOLReq1').prop("disabled", "disabled");
        $('#BOLReq2').prop("disabled", "disabled");
        $('#SecurityDeposit1').prop("disabled", "disabled");
        $('#SecurityDeposit2').prop("disabled", "disabled");
        $('#DamageScheme1').prop("disabled", "disabled");
        $('#DamageScheme2').prop("disabled", "disabled");
        $('#FreeDaysDest1').prop("disabled", "disabled");
        $('#FreeDaysDest2').prop("disabled", "disabled");
        $('#FreeDaysOrigin1').prop("disabled", "disabled");
        $('#FreeDaysOrigin2').prop("disabled", "disabled");
        this.showSave = true;
        this.showApprove = true;
        this.showReject = true;
        this.showCancel = true;
        this.ControlDisplay = true;

    }
    ForsControlDisable() {


        $("#ddlPrinciple").removeAttr('disabled');
        $("#txtRequestDate").removeAttr("disabled");
        $("#ddlEnquiryNo").removeAttr('disabled');

        $("#ddlSalesperson").removeAttr('disabled');
        $("#txtValidTill").removeAttr('disabled');
        $("#ddlOrigin").removeAttr("disabled");
        $("#ddlLoadPort").removeAttr("disabled");
        $("#ddlDischargePort").removeAttr('disabled');
        $('#ddlDestination').removeAttr('disabled');
        $('#ddlRouteType').removeAttr('disabled');
        $('#ddlDeliveryTerm').removeAttr('disabled');
        //$('#ddlOffice').removeAttr('disabled');




        $('#BOLReq1').removeAttr("disabled");
        $('#BOLReq2').removeAttr("disabled");
        $('#SecurityDeposit1').removeAttr("disabled");
        $('#SecurityDeposit2').removeAttr("disabled");
        $('#DamageScheme1').removeAttr("disabled");
        $('#DamageScheme2').removeAttr("disabled");
        $('#FreeDaysDest1').removeAttr("disabled");
        $('#FreeDaysDest2').removeAttr("disabled");
        $('#FreeDaysOrigin1').removeAttr("disabled");
        $('#FreeDaysOrigin2').removeAttr("disabled");
        $('#Remarks').removeAttr("disabled");


        var FreeDayOriginvx = this.rateForm.value.FreeDaysOrigin
        if (FreeDayOriginvx == 2) {
            $("#txtFreedaysOrg").removeAttr("disabled");

        }

        var FreeDayDestinationx = this.rateForm.value.FreeDaysDest
        if (FreeDayDestinationx == 2) {
            $("#txtFreedaysDest").removeAttr("disabled");

        }
        var DamageSchemex = this.rateForm.value.DamageScheme
        if (DamageSchemex == 2) {
            $("#txtDamageScheme").removeAttr("disabled");

        }
        var SecurityDepositx = this.rateForm.value.SecurityDeposit
        if (SecurityDepositx == 2) {
            $("#txtSecurityDeposit").removeAttr("disabled");

        }
        var BOLRequirementx = this.rateForm.value.BOLReq
        if (BOLRequirementx == 2) {
            $("#txtBOLReq").removeAttr("disabled");

        }


        //this.showSave = true;
        //this.showApprove = true;
        //this.showReject = true;
        //this.showCancel = true;
        //this.showRemarks = false;
        this.ControlDisplay = false;
        if ($("#ddlStatus").val() == 1) {
            this.disableSave = false;
            this.disableApprove = false;
            this.disableReject = false;
            this.disableCancel = false;
        }
        if ($("#ddlStatus").val() == 2) {
            this.disableSave = true;
            this.disableApprove = true;
            this.disableReject = true;
            this.disableCancel = true;
        }
        if ($("#ddlStatus").val() == 3) {
            this.disableSave = true;
            this.disableApprove = true;
            this.disableReject = true;
            this.disableCancel = true;
        }
        if ($("#ddlStatus").val() == 4) {
            this.disableSave = true;
            this.disableApprove = true;
            this.disableReject = true;
            this.disableCancel = true;
        }


    }
    StdSplChanged(gRow) {
        if (gRow.StdSplVID == 1) {

            gRow.StdSplVAmount = "";
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
    OnclickeEdit() {

        this.ForsControlDisable();

    }
    RemoveAttach(DynamicGridAttachLink, index, AID) {

        this.rateForm.value.AID = AID;
        this.DynamicGridAttachLink.splice(index, 1);
        this.rs.AttachDelete(this.rateForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
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

    selectedFile: File = null;
    uploadedfile: string = null;
    progress: string = '';

    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
        const filedata = new FormData();
        filedata.append('file', this.selectedFile, this.selectedFile.name)
        this.rs.AttachUpload(this.selectedFile).subscribe(
            (event) => {

                var fullpath = event;
                var res = JSON.stringify(fullpath).split('\\').pop().split('"}')[0]
                this.uploadedfile = res;
                // console.log(this.uploadedfile);

            }
        );

    }


}
interface Status {
    value: string;
    viewValue: string;
}
interface StatusSPL {
    value: string;
    viewValue: string;
}
