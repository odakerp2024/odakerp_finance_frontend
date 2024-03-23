import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from 'oidc-client';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { CommonValues, MyCustomerDropdown, MyCntrTypeDropdown, MyPortdrodown, MyTerminaldrodown, MyGeneraldropdown, myTerminal } from '../../../../../model/Admin';
import { PorttariffService } from '../../../../../services/porttariff.service';
import { Key } from 'protractor';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MastersService } from '../../../../../services/masters.service';
import { PrincipaltariffService, } from '../../../../../services/principaltariff.service';
import { OrgService } from '../../../../../services/org.service';
import { MYPrincipalTariff, mypricipalPort, myFreightDynamicGrid, myTerminalHandlingDynamicGrid, myLandsideChargesDynamicGrid } from 'src/app/model/PrincipalTraiff';
import { LinerName, GeneralMaster, ChargeTBMaster, BasicMaster, CurrencyMaster } from 'src/app/model/common';
import { Currency } from '../../../../../model/Party';
declare let $: any;

@Component({
    selector: 'app-principalagreement',
    templateUrl: './principalagreement.component.html',
    styleUrls: ['./principalagreement.component.css']
})
export class PrincipalagreementComponent implements OnInit {

    constructor(private fb: FormBuilder, private ES: EncrDecrServiceService, private router: Router, private route: ActivatedRoute, private ms: MastersService, private manage: PrincipaltariffService,
        private service: PorttariffService
    ) { }
    formGrop: FormGroup;
    errorMsg: string;
    RegId = 0;
    fillPortvalues: MyPortdrodown[];
    DynamicGrid: Array<mypricipalPort> = [];
    newDynamicGrid: any = {};
    Ag_id = "71";
    Com_id = "72";
    Ship_id = "1";
    fillAgreementType: GeneralMaster[];
    fillCommissionType: GeneralMaster[];
    fillShipmentType: GeneralMaster[];
    fillChargeType: ChargeTBMaster[];
    fillCurrency: CurrencyMaster[];
    fillCntrType: MyCntrTypeDropdown[];
    fillTerminal: myTerminal[];
    FreightCommDynamicGrid: Array<myFreightDynamicGrid> = [];


    newFreightCommDynamicGrid: any = {};
    TerminalHandlingDynamicGrid: Array<myTerminalHandlingDynamicGrid> = [];
    newTerminalHandlingDynamicGrid: any = {};
    DetentionDynamicGrid: Array<myFreightDynamicGrid> = [];
    newDetentionDynamicGrid: any = {};

    LandsideDynamicGrid: Array<myLandsideChargesDynamicGrid> = [];
    newLandsideDynamicGrid: any = {};

    ngOnInit() {

        this.newFreightCommDynamicGrid = { SID: 0, AgreementTypeID: 0, CommissionTypeID: 0, ShipmentTypeID: 0, ChargeTypeID: 0, CurrencyID: 0, CntrTypeID: 0, Amount: '' };
        this.FreightCommDynamicGrid.push(this.newFreightCommDynamicGrid);

        this.newTerminalHandlingDynamicGrid = {
            SID: 0, AgreementTypeID: 0, CommissionTypeID: 0, ShipmentTypeID: 0, PortID: 0, ChargeTypeID: 0, TerminalID: 0,
            CurrencyID: 0, CntrTypeID: 0, CollectAmt: '', CostAmt: '', DifferenceAmt: '', DiffRemittanceAmt: ''
        };
        this.TerminalHandlingDynamicGrid.push(this.newTerminalHandlingDynamicGrid);

        this.newDetentionDynamicGrid = { SID: 0, AgreementTypeID: 0, CommissionTypeID: 0, ShipmentTypeID: 0, ChargeTypeID: 0, CurrencyID: 0, CntrTypeID: 0, Amount: '' };
        this.DetentionDynamicGrid.push(this.newDetentionDynamicGrid);

        this.newLandsideDynamicGrid = {
            SID: 0, AgreementTypeID: 0, CommissionTypeID: 0, ShipmentTypeID: 0, PortID: 0, ChargeTypeID: 0, TerminalID: 0,
            CurrencyID: 0, CntrTypeID: 0, Amount: ''
        };
        this.LandsideDynamicGrid.push(this.newLandsideDynamicGrid);



        this.createform();
        this.InitDropdown();



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
                this.ExistingvaluesBind(queryString["ID"].toString());
            }
        });
    }


    createform() {

        this.formGrop = this.fb.group({
            ID: 0,
            LineCode: "",
            LineName: "",
            AlertMessage: "",
            ItemfreightComm: "",
            AlertMegId: "",
            TariffType: ""
        });
    }

    ExistingvaluesBind(Idv) {


        this.formGrop.value.ID = Idv;
        this.manage.EditPrincipalTariffMaster(this.formGrop.value).pipe().subscribe(data => {
            this.formGrop.patchValue(data[0]);
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        this.existinggridBind();
    }

    btntabclick(tab) {


        var values = "ID: " + this.formGrop.value.ID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1)
            this.router.navigate(['/views/masters/LAmaster/Principalagency/Principaldetails/Principaldetails'], { queryParams: { encrypted } });
        else if (tab == 2) {
            this.router.navigate(['/views/masters/LAmaster/Principalagency/Portdetails/Portdetails'], { queryParams: { encrypted } });
        }
        else if (tab == 3) {
            this.router.navigate(['/views/masters/LAmaster/Principalagency/Principalagreement/Principalagreement'], { queryParams: { encrypted } });
        }
        else if (tab == 4) {
            this.router.navigate(['/views/masters/LAmaster/Principalagency/Attachments/Attachments'], { queryParams: { encrypted } });
        }
        else if (tab == 5) {
            this.router.navigate(['/views/masters/LAmaster/Principalagency/Alertmails/Alertmails'], { queryParams: { encrypted } });
        }

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
        this.service.getCntrTypesList().subscribe(data => {
            this.fillCntrType = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        this.service.getPortList().subscribe(data => {
            this.fillPortvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.getGeneralList(this.Ag_id).subscribe(data => {
            this.fillAgreementType = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getGeneralList(this.Com_id).subscribe(data => {
            this.fillCommissionType = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getGeneralList(this.Ship_id).subscribe(data => {
            this.fillShipmentType = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getChargeCodeList().subscribe(data => {
            this.fillChargeType = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getCurrencyList().subscribe(data => {
            this.fillCurrency = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    btnAddFreightCommission(gRow, i) {

        var validation = "";
        if (gRow.AgreementTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Agreement Type</span></br>"
        }
        if (gRow.CommissionTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Commission Type</span></br>"
        }
        if (gRow.ShipmentTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Shipment Type</span></br>"
        }
        if (gRow.ChargeTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Charge Type</span></br>"
        }
        if (gRow.CurrencyID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Currency</span></br>"
        }
        if (gRow.CntrTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Cntr Type</span></br>"
        }
        if (gRow.Amount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        this.newFreightCommDynamicGrid = { ID: 0, AgreementTypeID: 0, CommissionTypeID: 0, ShipmentTypeID: 0, ChargeTypeID: 0, CurrencyID: 0, CntrTypeID: 0, Amount: '' };
        this.FreightCommDynamicGrid.push(this.newFreightCommDynamicGrid);
    }

    btngridTerminal(PortID, index, selectTerminal) {
        this.formGrop.value.PortID = PortID;
        this.manage.TerminalPortPortView(this.formGrop.value).subscribe(data => {


            $("#ddlTHTerminal" + index).html("");
            $("#ddlTHTerminal" + index).append($("<option>").text("--Select--").val(0).attr("label", "--Select--"))
            for (var i = 0; i < data.length; i++) {
                $("#ddlTHTerminal" + index).append($("<option>").text(data[i].TerminalName).val(data[i].ID).attr("label", data[i].TerminalName))

            }
            if (selectTerminal) {
                $("#ddlTHTerminal" + index).val(selectTerminal);

            }

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    OnClickAddTerminalHandling(gRow) {



        var validation = "";
        if (gRow.AgreementTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Agreement Type</span></br>"
        }
        if (gRow.CommissionTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Commission Type</span></br>"
        }
        if (gRow.ShipmentTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Shipment Type</span></br>"
        }
        if (gRow.PortID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Port Name</span></br>"
        }
        if (gRow.TerminalID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Terminal Name</span></br>"
        }


        if (gRow.ChargeTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Charge Type</span></br>"
        }
        if (gRow.CurrencyID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Currency</span></br>"
        }
        if (gRow.CntrTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Cntr Type</span></br>"
        }
        if (gRow.CollectAmt == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Collect Amt</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }




        this.newTerminalHandlingDynamicGrid = {
            ID: 0, AgreementTypeID: 0, CommissionTypeID: 0, ShipmentTypeID: 0, PortID: 0, ChargeTypeID: 0, TerminalID: 0,
            CurrencyID: 0, CntrTypeID: 0, CollectAmt: '', CostAmt: '', DifferenceAmt: '', DiffRemittanceAmt: ''
        };
        this.TerminalHandlingDynamicGrid.push(this.newTerminalHandlingDynamicGrid);
    }

    btnAddDetention(gRow) {


        var validation = "";
        if (gRow.AgreementTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Agreement Type</span></br>"
        }
        if (gRow.CommissionTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Commission Type</span></br>"
        }
        if (gRow.ShipmentTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Shipment Type</span></br>"
        }
        if (gRow.ChargeTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Charge Type</span></br>"
        }
        if (gRow.CurrencyID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Currency</span></br>"
        }
        if (gRow.CntrTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Cntr Type</span></br>"
        }
        if (gRow.Amount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        this.newDetentionDynamicGrid = { ID: 0, AgreementTypeID: 0, CommissionTypeID: 0, ShipmentTypeID: 0, ChargeTypeID: 0, CurrencyID: 0, CntrTypeID: 0, Amount: '' };
        this.DetentionDynamicGrid.push(this.newDetentionDynamicGrid);
    }

    btnAddLandside(gRow, index) {

        var validation = "";
        if (gRow.AgreementTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Agreement Type</span></br>"
        }
        if (gRow.CommissionTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Commission Type</span></br>"
        }
        if (gRow.ShipmentTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Shipment Type</span></br>"
        }
        if (gRow.ChargeTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Charge Type</span></br>"
        }
        if (gRow.CurrencyID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Currency</span></br>"
        }
        if (gRow.CntrTypeID == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Cntr Type</span></br>"
        }
        if (gRow.Amount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        this.newLandsideDynamicGrid = { ID: 0, AgreementTypeID: 0, CommissionTypeID: 0, ShipmentTypeID: 0, ChargeTypeID: 0, CurrencyID: 0, CntrTypeID: 0, Amount: '' };
        this.LandsideDynamicGrid.push(this.newLandsideDynamicGrid);
    }

    btngridLCTerminal(PortID, index, selectTerminal) {
        this.formGrop.value.PortID = PortID;
        this.manage.TerminalPortPortView(this.formGrop.value).subscribe(data => {
            $("#ddlLCTerminal" + index).html("");
            $("#ddlLCTerminal" + index).append($("<option>").text("--Select--").val(0).attr("label", "--Select--"))
            for (var i = 0; i < data.length; i++) {
                $("#ddlLCTerminal" + index).append($("<option>").text(data[i].TerminalName).val(data[i].ID).attr("label", data[i].TerminalName));
            }
            if (selectTerminal) {
                $("#ddlLCTerminal" + index).val(selectTerminal);

            }


        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    onSubmit() {

        var Validation = "";

        for (let item of this.FreightCommDynamicGrid) {

            if (item.AgreementTypeID == "0" || item.CommissionTypeID == "0" || item.ShipmentTypeID == "0" || item.ChargeTypeID == "0" || item.CurrencyID == "0"
                || item.CntrTypeID == "0" || item.Amount == "0") {
                Validation += "Please fill all Freight Commission Charges </br>";
            }
        }


        for (let item of this.TerminalHandlingDynamicGrid) {

            if (item.AgreementTypeID == "0" || item.CommissionTypeID == "0" || item.ShipmentTypeID == "0"
                || item.ChargeTypeID == "0" || item.PortID == 0 || item.TerminalID == "0"
                || item.CurrencyID == "0" || item.CntrTypeID == "0" || item.CollectAmt == ""
                || item.CostAmt == "" || item.DifferenceAmt == "" || item.DiffRemittanceAmt == "") {
                Validation += "Please fill all  Terminal Handling Charges </br>";
            }
        }

        for (let item of this.DetentionDynamicGrid) {
            if (item.AgreementTypeID == "0" || item.CommissionTypeID == "0" || item.ShipmentTypeID == "0"
                || item.ChargeTypeID == "0" || item.CurrencyID == "0" || item.CntrTypeID == "0"
                || item.Amount == ""
            ) {
                Validation += "Please fill all  Detention Charges </br>";
            }
        }

        for (let item of this.LandsideDynamicGrid) {
            if (item.AgreementTypeID == "0" || item.CommissionTypeID == "0" || item.ShipmentTypeID == "0"
                || item.ChargeTypeID == "0" || item.PortID == 0 || item.TerminalID == "0"
                || item.CurrencyID == "0" || item.CntrTypeID == "0" || item.Amount == ""
            ) {
                Validation += "Please fill all Landside Charges</br>";
            }
        }

        if (Validation != "") {
            Swal.fire(Validation);
            return;
        }



        var Items = [];
        for (let item of this.FreightCommDynamicGrid) {
            var SIDv = 0;
            if (item.Amount != "") {
                if (typeof item.SID == "undefined")
                    SIDv = 0;
                else
                    SIDv = item.SID;
                Items.push('Insert:' + SIDv, item.AgreementTypeID, item.CommissionTypeID, item.ShipmentTypeID, item.ChargeTypeID, 0, 0,
                    item.CurrencyID, item.CntrTypeID, item.Amount, 0, 0, 0, 0, 1
                );
            }
        }
        for (let item of this.TerminalHandlingDynamicGrid) {
            var SIDv = 0;
            if (item.CollectAmt != "") {
                if (typeof item.SID == "undefined")
                    SIDv = 0;
                else
                    SIDv = item.SID;

                Items.push('Insert:' + SIDv, item.AgreementTypeID, item.CommissionTypeID, item.ShipmentTypeID, item.ChargeTypeID, item.PortID, item.TerminalID,
                    item.CurrencyID, item.CntrTypeID, 0, item.CollectAmt, item.CostAmt, item.DifferenceAmt, item.DiffRemittanceAmt, 2
                );
            }
        }

        for (let item of this.DetentionDynamicGrid) {

            var SIDv = 0;
            if (item.Amount != "") {
                if (typeof item.SID == "undefined")
                    SIDv = 0;
                else
                    SIDv = item.SID;

                Items.push('Insert:' + SIDv, item.AgreementTypeID, item.CommissionTypeID, item.ShipmentTypeID, item.ChargeTypeID, 0, 0,
                    item.CurrencyID, item.CntrTypeID, item.Amount, 0, 0, 0, 0, 3
                );
            }
        }
        for (let item of this.LandsideDynamicGrid) {
            var SIDv = 0;
            if (item.Amount != "") {
                if (typeof item.SID == "undefined")
                    SIDv = 0;
                else
                    SIDv = item.SID;

                Items.push('Insert:' + SIDv, item.AgreementTypeID, item.CommissionTypeID, item.ShipmentTypeID, item.ChargeTypeID, item.PortID, item.TerminalID,
                    item.CurrencyID, item.CntrTypeID, item.Amount, 0, 0, 0, 0, 4
                );
            }
        }


        this.formGrop.value.Items = Items.toString();
        this.manage.InsertPrincipalTariffdtls(this.formGrop.value).subscribe((data) => {

            if (data.length > 0) {
                this.formGrop.value.ID = data[0].ID;
                Swal.fire(data[0].AlertMessage);
                this.existinggridBind();
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    existinggridBind() {
        this.formGrop.value.TariffType = 1;
        this.manage.existingPrincipalTariffAgreement(this.formGrop.value).pipe().subscribe(data => {
            if (data.length > 0) {
                this.FreightCommDynamicGrid.length = 0;
                for (let item of data) {
                    this.FreightCommDynamicGrid.push({
                        'SID': item.SID,
                        'AgreementTypeID': item.AgreementTypeID,
                        'CommissionTypeID': item.CommissionTypeID,
                        'ShipmentTypeID': item.ShipmentTypeID,
                        'ChargeTypeID': item.ChargeTypeID,
                        'CurrencyID': item.CurrencyID,
                        'CntrTypeID': item.CntrTypeID,
                        'Amount': item.Amount
                    });
                }
            }
            else {
                this.FreightCommDynamicGrid.length = 1;
            }



        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.formGrop.value.TariffType = 2;
        this.manage.existingPrincipalTariffAgreement(this.formGrop.value).pipe().subscribe(data => {

            if (data.length > 0) {
                this.TerminalHandlingDynamicGrid.length = 0;
                for (var i = 0; i < data.length; i++) {

                    this.TerminalHandlingDynamicGrid.push({
                        'SID': data[i].SID,
                        'AgreementTypeID': data[i].AgreementTypeID,
                        'CommissionTypeID': data[i].CommissionTypeID,
                        'ShipmentTypeID': data[i].ShipmentTypeID,
                        'ChargeTypeID': data[i].ChargeTypeID,
                        'CurrencyID': data[i].CurrencyID,
                        'CntrTypeID': data[i].CntrTypeID,
                        'CostAmt': data[i].CostAmt,
                        'CollectAmt': data[i].CollectionAmt,
                        'DifferenceAmt': data[i].DifferentAmt,
                        'DiffRemittanceAmt': data[i].DiffRemittanceAmt,
                        'PortID': data[i].PortID,
                        'TerminalID': data[i].TerminalID,
                    });

                    //alert(data[i].TerminalID);
                    this.btngridTerminal(data[i].PortID, i, data[i].TerminalID)
                }
            }
            else {
                this.TerminalHandlingDynamicGrid.length = 1;
            }



        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.formGrop.value.TariffType = 3;
        this.manage.existingPrincipalTariffAgreement(this.formGrop.value).pipe().subscribe(data => {

            if (data.length > 0) {
                this.DetentionDynamicGrid.length = 0;
                for (var i = 0; i < data.length; i++) {
                    this.DetentionDynamicGrid.push({
                        'SID': data[i].SID,
                        'AgreementTypeID': data[i].AgreementTypeID,
                        'CommissionTypeID': data[i].CommissionTypeID,
                        'ShipmentTypeID': data[i].ShipmentTypeID,
                        'ChargeTypeID': data[i].ChargeTypeID,
                        'CurrencyID': data[i].CurrencyID,
                        'CntrTypeID': data[i].CntrTypeID,
                        'Amount': data[i].Amount

                    });
                }
            }
            else {
                this.DetentionDynamicGrid.length = 1;
            }



        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.formGrop.value.TariffType = 4;
        this.manage.existingPrincipalTariffAgreement(this.formGrop.value).pipe().subscribe(data => {

            if (data.length > 0) {
                this.LandsideDynamicGrid.length = 0;
                for (var i = 0; i < data.length; i++) {


                    this.LandsideDynamicGrid.push({
                        'SID': data[i].SID,
                        'AgreementTypeID': data[i].AgreementTypeID,
                        'CommissionTypeID': data[i].CommissionTypeID,
                        'ShipmentTypeID': data[i].ShipmentTypeID,
                        'ChargeTypeID': data[i].ChargeTypeID,
                        'CurrencyID': data[i].CurrencyID,
                        'CntrTypeID': data[i].CntrTypeID,
                        'Amount': data[i].Amount,
                        'PortID': data[i].PortID,
                        'TerminalID': data[i].TerminalID

                    });
                    this.btngridLCTerminal(data[i].PortID, i, data[i].TerminalID);
                }
            }
            else {
                this.LandsideDynamicGrid.length = 1;
            }



        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    DynamicDeleteGrid(dynamicGrid, index, id) {
        dynamicGrid.splice(index, 1);
        this.formGrop.value.SID = id;
        this.manage.deletePrincipalTariff(this.formGrop.value).subscribe((data) => {
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    onClickQtyRatecalcuation(gRow) {
        gRow.DifferenceAmt = parseFloat(gRow.CollectAmt) - parseFloat(gRow.CostAmt);
    }

}
