import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { City } from '../../../../model/common';
import { Region, Office, State, Org, DynamicGrid, SalesOffice, SalesOfficeDD, DivisionTypes } from '../../../../model/org';
import { map, take, tap, startWith } from 'rxjs/operators';
import { MastersService } from '../../../../services/masters.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { PartyService } from '../../../../services/party.service';
import { Observable } from 'rxjs';
import { BusinessTypes, DynamicGridParty, Party, PartyAttachType, BranchList, GSTList, Currency, DynamicGridAcc, DynamicGridCr, DynamicGridAlert, DynamicGridAttach, DynamicGridVendorAcc } from 'src/app/model/Party';
import Swal from 'sweetalert2';
import { Country } from 'src/app/model/Organzation';
declare let $: any;


@Component({
    selector: 'app-vendor',
    templateUrl: './vendor.component.html',
    styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
    DynamicGrid: Array<DynamicGridParty> = [];
    DynamicGridAccLink: Array<DynamicGridVendorAcc> = [];
    DynamicGridCrLink: Array<DynamicGridCr> = [];
    DynamicGridAlertLink: Array<DynamicGridAlert> = [];
    DynamicGridAttachLink: Array<DynamicGridAttach> = [];
    Chkbox: Array<BusinessTypes> = [];
    val: any = {};
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    statusCrvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    tdsvalues: Status[] = [
        { value: '1', viewValue: 'TDS-TYPE-1' },
        { value: '2', viewValue: 'TDS-TYPE-2' },
    ];

    CID = null;
    dscountryItem: Country[];
    dsCityItem: City[];
    dataSource: Party[];
    dsBranchByPosItem: Party[]
    dsBTItem: BusinessTypes[];
    partyForm: FormGroup;
    partyAcc: FormGroup;
    dsStateItem: State[];
    dsAttachedDocumentTypes: PartyAttachType[];
    HDArrayIndex = '';
    cusID = 0;
    dsBranchList: BranchList[];
    dsGSTList: GSTList[];
    dsCurrList: Currency[];
    dsUserList: Party[];
    dsAlertTypeList: Party[];
    dsDivision: DivisionTypes[];
    constructor(private router: Router, private route: ActivatedRoute, private service: OrgService, private ms: MastersService, private ps: PartyService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {

            this.partyForm = this.fb.group({
                ID: params['id'],

            });

        });
    }
    onPageTab = function (val) {

        if (val == "2" || val == "3" || val == "4" || val == "5" || val == "6") {
            if (this.partyForm.value.ID == "0") {
                Swal.fire("Please Save Vendor Details First")
                $('#attachtab').addClass('active');
                $('#acctab').addClass('active');
                $('#crtab').addClass('active');
                $('#emailtab').addClass('active');
            }
        }
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
        $('#ddlCountry').on('select2:select', (e, args) => {
            this.CountryChanged($("#ddlCountry").val());
        });

        $('#ddlCity').on('select2:select', (e, args) => {
            this.BranchChanged($("#ddlCity").val())
        });

        $('#ddlBranch').on('select2:select', (e, args) => {
            this.BranchChangePOS($("#ddlBranch").val())
        });

    }
    onInitalBinding() {

        this.OnBindDropdownCountry();
        this.OnBindAttachTypes();
        this.OnBindPartyGSTlist();
        this.OnBindCurrencyList();
        this.OnBindUserList();
        this.OnBindAlertList();

    }
    OnBindDivisionTypes() {
        this.service.getDivisionTypes(this.partyForm.value).subscribe(data => {
            this.dsDivision = data;
        });
    }
    BranchChanged(cityval) {
        $('#txtBranch').val($("#ddlCity option:selected").text());
    }

    BranchChangePOS(BranchID) {

        this.partyForm.value.BranchID = BranchID;
        this.ps.getBranchByPOS(this.partyForm.value).subscribe(data => {
            this.dsBranchByPosItem = data;

        });
    }
    //ExistBranchChangePOS(BranchID) {
    //    this.partyForm.value.ID = BranchID;
    //    this.ps.getBranchByPOS(this.partyForm.value).subscribe(data => {
    //        this.dsBranchByPosItem = data;

    //    });
    //}
    CountryChanged(countryval) {

        this.partyForm.value.CountryID = countryval;
        this.service.getCitiesBindByCountry(this.partyForm.value).subscribe(data => {
            this.dsCityItem = data;
        });
        this.service.getStatesBindByCtry(this.partyForm.value).subscribe(data => {
            this.dsStateItem = data;

        });

    }
    OnBindAttachTypes() {
        this.ps.getPartyTypeAttchments().subscribe(data => {
            this.dsAttachedDocumentTypes = data;
        });
    }
    OnBindPartyBranchlist() {
        this.partyForm.value.BID = this.partyForm.value.ID;
        this.ps.getPartyBranchList(this.partyForm.value).subscribe(data => {
            this.dsBranchList = data;
        });
    }
    OnBindPartyGSTlist() {

        this.ps.getPartyGSTList(this.partyForm.value).subscribe(data => {
            this.dsGSTList = data;
        });
    }
    OnBindDropdownCountry() {
        this.ms.getCountryBind().subscribe(data => {
            this.dscountryItem = data;
        });
    }

    OnBindBusinessTypes() {
        this.ps.getBusinessTypes().subscribe(data => {
            this.dsBTItem = data;
        });
    }
    OnBindCurrencyList() {
        this.ps.getCurrencyBind().subscribe(data => {
            this.dsCurrList = data;
        });
    }
    OnBindUserList() {
        this.ps.getUserDetails(this.partyForm.value).subscribe(data => {
            this.dsUserList = data;
        });
    }
    OnBindAlertList() {
        this.ps.getAlertType(this.partyForm.value).subscribe(data => {
            this.dsAlertTypeList = data;
        });
    }
    createForm() {
        if (this.partyForm.value.ID != null) {
            this.OnBindPartyBranchlist();
            this.ps.getPartyEdit(this.partyForm.value).subscribe(data => {
                this.partyForm.patchValue(data[0]);

                $("#txtCustomerName").val(data[0].CustomerName);
                $('#ddlCountry').select2().val(data[0].CountryID);
                //$("#ddlCountry").val(data[0].CountryID);
                this.CountryChanged(data[0].CountryID);


            });
            this.ps.PartyExistingDivisonTypes(this.partyForm.value).subscribe(data => { this.dsDivision = data; });
            this.ps.getPartyExistingBusTypes(this.partyForm.value).subscribe(data => { this.dsBTItem = data; });

            this.ps.getPartyBranchDtlsEdit(this.partyForm.value).pipe(tap(data1 => {
                this.DynamicGrid.splice(0, 1);

                for (let item of data1) {

                    this.DynamicGrid.push({

                        'CID': item.CID,
                        'LocBranch': item.LocBranch,
                        'CityID': item.CityID,
                        'City': item.City,
                        'StateID': item.StateID,
                        'State': item.State,
                        'TelNo': item.TelNo,
                        'PinCode': item.PinCode,
                        'EmailID': item.EmailID,
                        'PIC': item.PIC,
                        'Address': item.Address,
                        'StatusID': item.StatusID,
                        'StatusResult': item.StatusResult

                    });

                }
            }
            )).subscribe();

            this.ps.getVendorAccEdit(this.partyForm.value).pipe(tap(data1 => {
                this.DynamicGridAccLink.splice(0, 1);

                for (let item of data1) {

                    this.DynamicGridAccLink.push({
                        'ID': item.ID,
                        'Branch': item.Branch,
                        'BranchID': item.BranchID,
                        'GSTINTax': item.GSTINTax,
                        'GSTListID': item.GSTListID,
                        'GSTNo': item.GSTNo,
                        'TAN': item.TAN,
                        'PAN': item.PAN,
                        'Legalname': item.Legalname,
                        'POS': item.POS,
                        'POSID': item.POSID,
                        'TDS': item.TDS,
                        'TDSType': item.TDSType,
                        'CurrencyCode': item.CurrencyCode,
                        'CurrID': item.CurrID,

                    });

                }
            }
            )).subscribe();

            this.ps.getPartyCrEdit(this.partyForm.value).pipe(tap(data1 => {
                this.DynamicGridCrLink.splice(0, 1);

                for (let item of data1) {

                    this.DynamicGridCrLink.push({
                        'ID': item.ID,
                        'Branch': item.Branch,
                        'BranchID': item.BranchID,
                        'CreditDays': item.CreditDays,
                        'CreditLimit': item.CreditLimit,
                        'ApprovedBy': item.ApprovedBy,
                        'ApprovedName': item.ApprovedName,
                        'EffectiveDate': item.EffectiveDate,
                        'StatusV': item.StatusV,
                        'StatusCrID': item.StatusCrID,


                    });

                }
            }
            )).subscribe();


            this.ps.getPartyEmailDtlsEdit(this.partyForm.value).pipe(tap(data1 => {
                this.DynamicGridAlertLink.splice(0, 1);

                for (let item of data1) {

                    this.DynamicGridAlertLink.push({
                        'ID': item.ID,
                        'Branch': item.Branch,
                        'BranchID': item.BranchID,
                        'AlertTypeID': item.AlertTypeID,
                        'AlertType': item.AlertType,
                        'EmailAlertID': item.EmailAlertID,


                    });

                }
            }
            )).subscribe();

            this.ps.getPartyAttachDtlsEdit(this.partyForm.value).pipe(tap(data1 => {
                this.DynamicGridAttachLink.splice(0, 1);

                for (let item of data1) {

                    this.DynamicGridAttachLink.push({

                        'AttachFile': item.AttachFile,
                        'AttachID': item.AttachID,
                        'AttachName': item.AttachName,



                    });

                }
            }
            )).subscribe();
            this.partyForm = this.fb.group({

                ID: 0,
                CustomerName: '',
                CountryID: 0,
                IsNVOCC: 0,
                IsFF: 0,
                Itemsv1: '',
                BusinessType: '',
                BranchID: 0,
                DivisionDetails: ''
            });
        }
        else {
            this.partyForm = this.fb.group({
                ID: 0,
                CustomerName: '',
                CountryID: 0,
                IsNVOCC: 0,
                IsFF: 0,
                Itemsv1: '',
                BusinessType: '',
                BranchID: 0,
                DivisionDetails: ''
            });
            this.OnBindDivisionTypes();
            this.OnBindBusinessTypes();
            $('#ddlCountry').select2().val(0);
        }

    }



    AddBranch() {
        var validation = "";

        var ddlLocCity = $('#ddlCity').val();
        if (ddlLocCity == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select City</span></br>"
        }
        var txtBranch = $('#txtBranch').val();
        if (txtBranch.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Branch</span></br>"
        }
        var txtTel = $('#txtTel').val();
        if (txtTel.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter TelNo</span></br>"
        }
        var txtPincode = $('#txtPincode').val();
        if (txtPincode.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Pincode</span></br>"
        }
        var txtPic = $('#txtPic').val();
        if (txtPic.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter PIC</span></br>"
        }
        var txtLocAddress = $('#txtLocAddress').val();
        if (txtLocAddress.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Address</span></br>"
        }
        var ddlStatus = $('#ddlStatus').val();
        if (ddlStatus == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Status</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation)
            return false;
        }

        for (var i = 0; i < this.DynamicGrid.length; i++) {

            if (this.CID == null) {
                if (this.DynamicGrid[i].CityID == $('#ddlCity').val()) {

                    validation += "<span style='color:red;'>*</span> <span>Branch Already Exists </span></br>"
                }
            }
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        var CIDValue;
        CIDValue = (this.CID == null) ? 0 : this.CID;

        this.val = {

            CID: CIDValue,
            LocBranch: $("#txtBranch").val(),
            CityID: $("#ddlCity").val(),
            City: $("#ddlCity option:selected").text(),
            StateID: $("#ddlState").val(),
            State: $("#ddlState option:selected").text(),
            TelNo: $("#txtTel").val(),
            PinCode: $("#txtPincode").val(),
            EmailID: $("#txtEmailID").val(),
            PIC: $("#txtPic").val(),
            Address: $("#txtLocAddress").val(),
            StatusID: $("#ddlStatus").val(),
            StatusResult: $("#ddlStatus option:selected").text(),
            //PanNo: $("#txtPanNo").val(),
            //TanNo: $("#txtTanNo").val(),
        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGrid[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGrid.push(this.val);
        }

        $("#ddlCity").select2().val(0, "").trigger("change");
        $("#ddlState").select2().val(0, "").trigger("change");
        $("#ddlStatus").select2().val(0, "").trigger("change");
        $("#txtBranch").val("");
        $("#txtTel").val("");
        $("#txtPincode").val("");
        $("#txtEmailID").val("");
        $("#txtPic").val("");
        $("#txtLocAddress").val("");
        //$("#txtPanNo").val("");
        //$("#txtTanNo").val("");

        this.HDArrayIndex = "";
        this.CID = 0;
    }

    AddAttach() {
        var validation = "";

        var ddlAttachType = $('#ddlAttachType').val();
        if (ddlAttachType == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Attachment Type</span></br>"
        }

        var txtAttachFile = $('#txtAttachFile').val();
        if (txtAttachFile.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Upload File</span></br>"
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }

        this.val = {
            AttachID: $("#ddlAttachType").val(),
            AttachName: $("#ddlAttachType option:selected").text(),
            AttachFile: $("#txtAttachFile").val(),
        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGridAttachLink[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGridAttachLink.push(this.val);
        }

        $("#ddlAttachType").select2().val(0, "").trigger("change");
        $("#txtAttachFile").val("");

        this.HDArrayIndex = "";

    }

    AddAccLink() {
        var validation = "";

        var ddlBranch = $('#ddlBranch').val();
        if (ddlBranch == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Branch</span></br>"
        }
        var ddlGstlist = $('#ddlGstlist').val();
        if (ddlGstlist == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select GST Category</span></br>"
        }
        var txtGST = $('#txtGST').val();
        if (txtGST.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter GST No</span></br>"
        }
        var txtLegalname = $('#txtLegalname').val();
        if (txtLegalname.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Legal Name</span></br>"
        }
        var ddlCurrency = $('#ddlCurrency').val();
        if (ddlCurrency == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Currency</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        for (var i = 0; i < this.DynamicGridAccLink.length; i++) {

            if (this.CID == null) {
                if (this.DynamicGridAccLink[i].BranchID == $('#ddlBranch').val()) {

                    validation += "<span style='color:red;'>*</span> <span>Branch Already Exists </span></br>"
                }
            }
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        this.val = {


            BranchID: $("#ddlBranch").val(),
            Branch: $("#ddlBranch option:selected").text(),
            GSTListID: $("#ddlGstlist").val(),
            GSTINTax: $("#ddlGstlist option:selected").text(),
            GSTNo: $("#txtGST").val(),
            Legalname: $("#txtLegalname").val(),
            PAN: $("#txtPAN").val(),
            TAN: $("#txtTAN").val(),
            POSID: $("#ddlPOS").val(),
            POS: $("#ddlPOS option:selected").text(),
            TDS: $("#ddlTDS").val(),
            TDSType: $("#ddlTDS option:selected").text(),
            CurrID: $("#ddlCurrency").val(),
            CurrencyCode: $("#ddlCurrency option:selected").text(),

        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGridAccLink[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGridAccLink.push(this.val);
        }

        $("#ddlBranch").select2().val(0, "").trigger("change");
        $("#ddlGstlist").select2().val(0, "").trigger("change");
        $("#ddlPOS").select2().val(0, "").trigger("change");
        $("#ddlCurrency").select2().val(0, "").trigger("change");
        $("#txtGST").val("");
        $("#txtLegalname").val("");
        $("#txtPAN").val("");
        $("#txtTAN").val("");

        this.HDArrayIndex = "";

    }

    AddCrLink() {
        var validation = "";

        var ddlCrBranch = $('#ddlCrBranch').val();
        if (ddlCrBranch == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Branch</span></br>"
        }

        var txtCrDays = $('#txtCrDays').val();
        if (txtCrDays.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Credit Days</span></br>"
        }
        var txtCrLmt = $('#txtCrLmt').val();
        if (txtCrLmt.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Credit Limit</span></br>"
        }
        var ddlUser = $('#ddlUser').val();
        if (ddlUser == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Approved by</span></br>"
        }
        var txtEffDate = $('#txtEffDate').val();
        if (txtEffDate.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Effective Date</span></br>"
        }
        var ddlCrStatus = $('#ddlCrStatus').val();
        if (ddlCrStatus == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Status </span></br>"
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }

        this.val = {


            BranchID: $("#ddlCrBranch").val(),
            Branch: $("#ddlCrBranch option:selected").text(),
            CreditDays: $("#txtCrDays").val(),
            CreditLimit: $("#txtCrLmt").val(),
            ApprovedBy: $("#ddlUser").val(),
            ApprovedName: $("#ddlUser option:selected").text(),
            EffectiveDate: $("#txtEffDate").val(),
            StatusCrID: $("#ddlCrStatus").val(),
            StatusV: $("#ddlCrStatus option:selected").text(),

        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGridCrLink[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGridCrLink.push(this.val);
        }

        $("#ddlCrBranch").select2().val(0, "").trigger("change");
        $("#ddlUser").select2().val(0, "").trigger("change");
        $("#ddlCrStatus").select2().val(0, "").trigger("change");
        $("#txtCrDays").val("");
        $("#txtCrLmt").val("");
        $("#txtEffDate").val("");

        this.HDArrayIndex = "";

    }



    AddEmailLink() {
        var validation = "";

        var ddlAlertBranch = $('#ddlAlertBranch').val();
        if (ddlAlertBranch == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Branch</span></br>"
        }

        var ddlAlertType = $('#ddlAlertType').val();
        if (ddlAlertType == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Alert Types</span></br>"
        }
        var txtEmailAlertID = $('#txtEmailAlertID').val();
        if (txtEmailAlertID.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Email ID</span></br>"
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }

        this.val = {
            BranchID: $("#ddlAlertBranch").val(),
            Branch: $("#ddlAlertBranch option:selected").text(),
            AlertTypeID: $("#ddlAlertType").val(),
            AlertType: $("#ddlAlertType option:selected").text(),
            EmailAlertID: $("#txtEmailAlertID").val(),
        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGridAlertLink[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGridAlertLink.push(this.val);
        }

        $("#ddlAlertType").select2().val(0, "").trigger("change");
        $("#ddlAlertBranch").select2().val(0, "").trigger("change");
        $("#txtEmailAlertID").val("");

        this.HDArrayIndex = "";

    }

    Selectvalues(DynamicGrid, index) {

        this.HDArrayIndex = index;
        this.CID = this.DynamicGrid[index].CID;

        $("#ddlCity").select2().val(this.DynamicGrid[index].CityID).trigger("change");
        $("#ddlState").select2().val(this.DynamicGrid[index].StateID).trigger("change");
        $("#ddlStatus").select2().val(this.DynamicGrid[index].StatusID).trigger("change");
        $("#txtBranch").val(this.DynamicGrid[index].LocBranch);
        $("#txtTel").val(this.DynamicGrid[index].TelNo);
        $("#txtPincode").val(this.DynamicGrid[index].PinCode);
        $("#txtEmailID").val(this.DynamicGrid[index].EmailID);
        $("#txtPic").val(this.DynamicGrid[index].PIC);
        $("#txtLocAddress").val(this.DynamicGrid[index].Address);

        //$("#txtPanNo").val(this.DynamicGrid[index].PanNo);
        //$("#txtTanNo").val(this.DynamicGrid[index].TanNo);
    }

    SelectAccvalues(DynamicGridAccLink, index) {

        this.HDArrayIndex = index;

        //$("#ddlBranch").select2().val(this.DynamicGridAccLink[index].BranchID).trigger("change");
        $("#ddlBranch").select2().val(this.DynamicGridAccLink[index].BranchID).trigger("change");
        $("#ddlGstlist").select2().val(this.DynamicGridAccLink[index].GSTListID).trigger("change");
        $("#ddlTDS").select2().val(this.DynamicGridAccLink[index].TDS).trigger("change");
        $("#ddlCurrency").select2().val(this.DynamicGridAccLink[index].CurrID).trigger("change");
        $("#ddlPOS").select2().val(this.DynamicGridAccLink[index].POSID).trigger("change");
        $("#txtGST").val(this.DynamicGridAccLink[index].GSTNo);
        $("#txtLegalname").val(this.DynamicGridAccLink[index].Legalname);
        $("#txtPAN").val(this.DynamicGridAccLink[index].PAN);
        $("#txtTAN").val(this.DynamicGridAccLink[index].TAN);

        this.BranchChangePOS(this.DynamicGridAccLink[index].BranchID);

    }

    SelectCrvalues(DynamicGridCrLink, index) {

        this.HDArrayIndex = index;
        //$("#ddlBranch").select2().val(this.DynamicGridAccLink[index].BranchID).trigger("change");
        $("#ddlCrBranch").val(this.DynamicGridCrLink[index].BranchID).trigger("change");
        $("#ddlUser").val(this.DynamicGridCrLink[index].ApprovedBy).trigger("change");
        $("#ddlCrStatus").select2().val(this.DynamicGridCrLink[index].StatusCrID).trigger("change");
        $("#txtCrLmt").val(this.DynamicGridCrLink[index].CreditLimit);
        $("#txtCrDays").val(this.DynamicGridCrLink[index].CreditDays);
        $("#txtEffDate").val(this.DynamicGridCrLink[index].EffectiveDate);

        ;
    }

    SelectEmailAlert(DynamicGridAlertLink, index) {

        this.HDArrayIndex = index;
        //$("#ddlBranch").select2().val(this.DynamicGridAccLink[index].BranchID).trigger("change");
        $("#ddlAlertBranch").val(this.DynamicGridAlertLink[index].BranchID).trigger("change");
        $("#ddlAlertType").val(this.DynamicGridAlertLink[index].AlertTypeID).trigger("change");
        $("#txtEmailAlertID").val(this.DynamicGridAlertLink[index].EmailAlertID);


    }

    RemoveBranch(DynamicGrid, index, CID) {
        this.partyForm.value.ID = CID;
        this.DynamicGrid.splice(index, 1);
        this.ps.CusVendorBranchDelete(this.partyForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    RemoveAccValues(DynamicGridAccLink, index, CID) {

        this.partyForm.value.ID = CID;
        this.DynamicGridAccLink.splice(index, 1);
        this.ps.CusVendorAccLinkDelete(this.partyForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    RemoveCrvalues(DynamicGridCrLink, index, CID) {

        this.partyForm.value.ID = CID;
        this.DynamicGridCrLink.splice(index, 1);
        this.ps.CusVendorCrLinkDelete(this.partyForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    RemoveAlertvalues(DynamicGridAlertLink, index, CID) {

        this.partyForm.value.ID = CID;
        this.DynamicGridAlertLink.splice(index, 1);
        this.ps.CusVendorAlertLinkDelete(this.partyForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }


    OnSubmit() {

        var validation = "";

        if (this.partyForm.value.CustomerName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Customer Name</span></br>"
        }
        if ($("#ddlCountry").val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Country</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        var validation = "";

        if (this.DynamicGrid.length == 0) {

            validation += "<span style='color:red;'>*</span> <span>Please Add Branch Details </span></br>"
        }


        if (validation != "") {
            Swal.fire(validation)
            return false;
        }

        var Itemsd = [];
        for (var i = 0; i < this.dsDivision.length; i++) {

            if (this.dsDivision[i].IsTrue) {
                var Id = this.dsDivision[i].ID;
                Itemsd.push(Id);

            }

        }

        this.partyForm.value.DivisionDetails = Itemsd.toString();

        var Itemsc = [];
        for (var i = 0; i < this.dsBTItem.length; i++) {

            if (this.dsBTItem[i].IsTrue) {

                var Id = this.dsBTItem[i].ID;
                Itemsc.push(Id);
            }
        }

        this.partyForm.value.BusinessType = Itemsc.toString();
        var Items = [];
        for (let item of this.DynamicGrid) {

            Items.push('Insert:' + item.CID, item.LocBranch, item.CityID, item.City, item.StateID, item.State,
                item.TelNo, item.PinCode, item.EmailID, item.PIC, item.StatusID, item.StatusResult, 'Address:' + item.Address);

        };
        this.partyForm.value.Itemsv1 = Items.toString();
        this.partyForm.value.CountryID = $('#ddlCountry').val();
        if (this.partyForm.value.IsNVOCC == true) {
            this.partyForm.value.IsNVOCC = 1;
        }
        else {
            ;
            this.partyForm.value.IsNVOCC = 0;
        }
        if (this.partyForm.value.IsFF == true) {
            this.partyForm.value.IsFF = 1;
        }
        else {
            this.partyForm.value.IsFF = 0;
        }
        // this.partyForm.value.ID = this.partyForm.value.ID;
        this.ps.VendorSave(this.partyForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
            setTimeout(() => {
                this.router.navigate(['/views/masters/commonmaster/vendor/vendorview']);
            }, 2000);  //5s
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

    OnSubmitAcc() {
        var validation = "";

        if (this.DynamicGridAccLink.length == 0) {

            validation += "<span style='color:red;'>*</span> <span>Please Add Accounting Link Details </span></br>"
        }


        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        var ItemsAcc = [];
        for (let item of this.DynamicGridAccLink) {

            ItemsAcc.push('Insert:' + item.BranchID, item.Branch, item.GSTListID, item.GSTINTax, item.GSTNo, item.Legalname,
                item.PAN, item.TAN, item.POSID, item.POS, item.TDS, item.TDSType, item.CurrID, item.CurrencyCode);

        };
        this.partyForm.value.Itemsv1 = ItemsAcc.toString();


        this.ps.VendorAccSave(this.partyForm.value).subscribe(cty => { Swal.fire("Record Saved Successfully") });
    }

    OnSubmitCr() {
        var validation = "";

        if (this.DynamicGridCrLink.length == 0) {

            validation += "<span style='color:red;'>*</span> <span>Please Add Credit Limit Details </span></br>"
        }


        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        var ItemsCr = [];
        for (let item of this.DynamicGridCrLink) {

            ItemsCr.push('Insert:' + item.BranchID, item.Branch, item.CreditDays, item.CreditLimit, item.ApprovedBy,
                item.ApprovedName, item.EffectiveDate, item.StatusCrID, item.StatusV);

        };
        this.partyForm.value.Itemsv1 = ItemsCr.toString();


        this.ps.partyCrSave(this.partyForm.value).subscribe(cty => { Swal.fire("Record Saved Successfully") });
    }

    OnSubmitEmailAlert() {
        var validation = "";

        if (this.DynamicGridAlertLink.length == 0) {

            validation += "<span style='color:red;'>*</span> <span>Please Add Email Alert Details </span></br>"
        }


        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        var ItemsAlert = [];
        for (let item of this.DynamicGridAlertLink) {

            ItemsAlert.push('Insert:' + item.BranchID, item.Branch, item.AlertTypeID, item.AlertType, item.EmailAlertID);

        };
        this.partyForm.value.Itemsv1 = ItemsAlert.toString();
        this.ps.partyEmailAlertSave(this.partyForm.value).subscribe(cty => { Swal.fire("Record Saved Successfully") });
    }

    RecordAttachSave() {

        var validation = "";

        if (this.DynamicGridAttachLink.length == 0) {

            validation += "<span style='color:red;'>*</span> <span>Please Add Attachment Details </span></br>"
        }


        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        var ItemsAttach = [];
        for (let item of this.DynamicGridAttachLink) {

            ItemsAttach.push('Insert:' + item.AttachFile, item.AttachID, item.AttachName);

        };
        this.partyForm.value.Itemsv1 = ItemsAttach.toString();
        this.ps.partyAttachSave(this.partyForm.value).subscribe(cty => { Swal.fire("Record Saved Successfully") });

    }
}
interface Status {
    value: string;
    viewValue: string;
}

