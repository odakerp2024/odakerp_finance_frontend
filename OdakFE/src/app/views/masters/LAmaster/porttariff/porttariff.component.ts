import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { CommonValues, MyCustomerDropdown, MyCntrTypeDropdown, MyPortdrodown, MyTerminaldrodown, MyGeneraldropdown } from '../../../../model/Admin';
import { LinerName, GeneralMaster, ChargeTBMaster, BasicMaster, CurrencyMaster } from 'src/app/model/common';
import { MyDynamicGrid, MYPortTariff, MyDynamicGridSlab, MyDynamicGridIHC, MyDynamicGridDOCharges, myDynamicGridTHCCharges, myDynamicIHCBrackupCharges } from '../../../../model/PortTariff';

import { PrincipaltariffService, } from '../../../../services/principaltariff.service';
import { MYPrincipalTariff, mypricipalPort, myFreightDynamicGrid, myTerminalHandlingDynamicGrid, myLandsideChargesDynamicGrid, myFreightDynamicGridview } from 'src/app/model/PrincipalTraiff';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { PorttariffService } from '../../../../services/porttariff.service';
import { User } from 'oidc-client';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Key } from 'protractor';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
declare let $: any;


@Component({
    selector: 'app-porttariff',
    templateUrl: './porttariff.component.html',
    styleUrls: ['./porttariff.component.css']
})
export class PorttariffComponent implements OnInit {

    CustomerMasterAllvalues: MyCustomerDropdown[];
    CntrTypesvalues: MyCntrTypeDropdown[];
    PortAllvalues: MyPortdrodown[];
    AllHandlingTermsvalues: MyTerminaldrodown[];
    ShipmentType: CommonValues[];
    FillGeneralMaster: GeneralMaster[];
    CommodityAllvalues: GeneralMaster[];
    ServiceTypeAllvalues: GeneralMaster[];
    FillShipmentTypes: GeneralMaster[];
    fillPaymentTo: GeneralMaster[];
    ChargeCodeAllvalues: ChargeTBMaster[];
    ChargeCodeDetentionAllvalues: ChargeTBMaster[];
    BasicBindValues: BasicMaster[];
    CurrencyValue: CurrencyMaster[];
    TID = null;
    HDArrayIndex = '';
    Amount = '';
    ShipmentTypeID;
    TIDValue = '';
    modid = "40";
    Commmodid = "2";
    svModid = "66";
    svshipment = "50";
    svPaymentTo = "51";
    DynamicGrid: Array<MyDynamicGrid> = [];
    DynamicIHCGrid: Array<MyDynamicGridIHC> = [];
    DataValues: MYPortTariff;
    DynamicDetentionGrid: Array<MyDynamicGridSlab> = [];
    DynamicDetentionGridImp: Array<MyDynamicGridSlab> = [];
    DynamicRevenuDOChargesGrid: Array<MyDynamicGridDOCharges> = [];
    DynamicTHCChargesGrid: Array<myDynamicGridTHCCharges> = [];
    DynamicIHCBrackupChargesGrid: Array<myDynamicIHCBrackupCharges> = [];
    val: any = {};
    portTariffForm: FormGroup;
    errorMsg: string;
    RegId = 0;
    TabControll = 1;
    ddlPrinciple = null;
    public BreakupVisible: any = {};
    newDynamicSlabExp: any = {};
    newDynamicSlabImp: any = {};
    newDynamicIHC: any = {};
    newDynamicRevenuDOCharges: any = {};
    newDynamicTHCChargesGrid: any = {};
    newDynamicIHCBrackupChargesGrid: any = {};

    DynamicStorageExpLadenGrid: Array<MyDynamicGridSlab> = [];
    DynamicStorageExpEmptyGrid: Array<MyDynamicGridSlab> = [];
    DynamicStorageImpLadenGrid: Array<MyDynamicGridSlab> = [];
    DynamicStorageImpEmptyGrid: Array<MyDynamicGridSlab> = [];
    newDynamicStorageExpLadenGrid: any = {};
    newDynamicStorageExpEmptyGrid: any = {};
    newDynamicStorageImpLadenGrid: any = {};
    newDynamicStorageImpEmptyGrid: any = {};

    //LandsideDynamicGrid: Array<myLandsideChargesDynamicGrid> = [];
    //newLandsideDynamicGrid: any = {};

    FreightCommDynamicGrid: Array<myFreightDynamicGridview> = [];
    newFreightCommDynamicGrid: any = {};
    //TerminalHandlingDynamicGrid: Array<myTerminalHandlingDynamicGrid> = [];
    //newTerminalHandlingDynamicGrid: any = {};
    //DetentionDynamicGrid: Array<myFreightDynamicGrid> = [];
    //newDetentionDynamicGrid: any = {};


    constructor(private router: Router, private route: ActivatedRoute, private service: PorttariffService, private fb: FormBuilder, private ES: EncrDecrServiceService, private manage: PrincipaltariffService) { }

    ngOnInit() {

        this.BreakupVisible = false;
        this.newDynamicSlabExp = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
        this.DynamicDetentionGrid.push(this.newDynamicSlabExp);
        this.newDynamicSlabImp = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
        this.DynamicDetentionGridImp.push(this.newDynamicSlabImp);

        this.newDynamicIHC = { SLID: 0, SlabFrom: '', SlabTo: '', CurrencyID: '', RevenueAmount: '', CostAmount: '', LineAmount: '' };
        this.DynamicIHCGrid.push(this.newDynamicIHC);

        this.newDynamicRevenuDOCharges = { SLID: 0, SlabUpto: '', CurrencyID: 0, Amount: '' };
        this.DynamicRevenuDOChargesGrid.push(this.newDynamicRevenuDOCharges);


        this.newDynamicTHCChargesGrid = { SLID: 0, ChargeCodeID: '', CommodityID: 0, CurrencyID: 0, ShipmentID: 0, CntrType: 0, Amount: '', ExRate: '', LocalAmount: '' };
        this.DynamicTHCChargesGrid.push(this.newDynamicTHCChargesGrid);

        this.newDynamicIHCBrackupChargesGrid = { SLID: 0, ChargeCodeID: '', PaymentTo: 0, Amount: '' };
        this.DynamicIHCBrackupChargesGrid.push(this.newDynamicIHCBrackupChargesGrid);


        this.newDynamicStorageExpLadenGrid = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
        this.DynamicStorageExpLadenGrid.push(this.newDynamicStorageExpLadenGrid);

        this.newDynamicStorageExpEmptyGrid = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
        this.DynamicStorageExpEmptyGrid.push(this.newDynamicStorageExpEmptyGrid);

        this.newDynamicStorageImpLadenGrid = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
        this.DynamicStorageImpLadenGrid.push(this.newDynamicStorageImpLadenGrid);

        this.newDynamicStorageImpEmptyGrid = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
        this.DynamicStorageImpEmptyGrid.push(this.newDynamicStorageImpEmptyGrid);


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
                this.RegId = queryString["ID"].toString();
                this.portTariffForm = this.fb.group({
                    ID: queryString["ID"].toString(),

                });
                this.ExistingPortTariffBind();

            }

        });

        $('#ddlPortv').on('select2:select', (e, args) => {
            this.OnClickPortTerminal($("#ddlPortv").val());
        });


    }
    InitBind() {
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
        this.InitDropdown();

    }
    InitDropdown() {


        this.ShipmentType = [
            { ID: '1', Desc: 'EXPORT' },
            { ID: '2', Desc: 'IMPORT' },
        ];

        this.BasicBindValues = [
            { ID: '1', name: 'BL' },
            { ID: '2', name: 'Container' },

        ];

        this.service.getPrincibleList().subscribe(data => {
            this.CustomerMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getCntrTypesList().subscribe(data => {
            this.CntrTypesvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        this.service.getPortList().subscribe(data => {
            this.PortAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.getGeneralList(this.modid).subscribe(data => {
            this.FillGeneralMaster = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        this.service.getChargeCodeList().subscribe(data => {
            this.ChargeCodeAllvalues = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        this.service.getCommoditylList(this.Commmodid).subscribe(data => {
            this.CommodityAllvalues = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getCurrencyList().subscribe(data => {
            this.CurrencyValue = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getServiceTypelList(this.svModid).subscribe(data => {
            this.ServiceTypeAllvalues = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getChargeCodeDetentionList().subscribe(data => {
            this.ChargeCodeDetentionAllvalues = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.service.getGeneralList(this.svshipment).subscribe(data => {
            this.FillShipmentTypes = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.service.getPaymentTolList(this.svPaymentTo).subscribe(data => {
            this.fillPaymentTo = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });




    }


    OnClickPortTerminal(PortIDv) {

        this.portTariffForm.value.PortID = PortIDv
        this.service.getTerminalList(this.portTariffForm.value).subscribe(data => {
            this.AllHandlingTermsvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    OnClickAddValue() {


        var validation = "";
        var ddlShipmentType = $('#ddlShipmentType').val();
        if (ddlShipmentType == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Shipment Type</span></br>"
        }

        var ddlTariffType = $('#ddlTariffType').val();
        if (ddlTariffType == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Tariff Type</span></br>"
        }

        var ddlChargeCode = $('#ddlChargeCode').val();
        if (ddlChargeCode == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Charge Code</span></br>"
        }

        var ddlCommodity = $('#ddlCommodity').val();
        if (ddlCommodity == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Commodity</span></br>"
        }

        var ddlBasis = $('#ddlBasis').val();
        if (ddlBasis == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Basic</span></br>"
        }

        var ddlCurrency = $('#ddlCurrency').val();
        if (ddlCurrency == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Currency</span></br>"
        }

        var ddlServiceType = $('#ddlServiceType').val();
        if (ddlServiceType == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Service Type</span></br>"
        }

        var txtAmount = $('#txtAmount').val();
        if (txtAmount == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Amount</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation);
            return false;
        }


        var TIDValue;
        TIDValue = (this.TID == null) ? 0 : this.TID;
        this.val = {
            TID: TIDValue,
            ShipmentType: $("#ddlShipmentType option:selected").text(),
            ShipmentTypeID: $("#ddlShipmentType").val(),
            TariffTypeID: $("#ddlTariffType").val(),
            TariffType: $("#ddlTariffType option:selected").text(),
            ChargeCode: $("#ddlChargeCode option:selected").text(),
            ChargeCodeID: $("#ddlChargeCode").val(),
            Commodity: $("#ddlCommodity option:selected").text(),
            CommodityID: $("#ddlCommodity").val(),
            BasisID: $("#ddlBasis").val(),
            Basis: $("#ddlBasis option:selected").text(),
            CurrencyID: $("#ddlCurrency").val(),
            Currency: $("#ddlCurrency option:selected").text(),
            ServiceType: $("#ddlServiceType option:selected").text(),
            ServiceTypeID: $("#ddlServiceType").val(),
            Amount: $("#txtAmount").val()
        };

        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGrid[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGrid.push(this.val);
        }
        $("#ddlShipmentType").val(0, "").trigger("change");
        $("#ddlTariffType").select2().val(0, "").trigger("change");
        $("#ddlChargeCode").select2().val(0, "").trigger("change");
        $("#ddlCommodity").select2().val(0, "").trigger("change");
        $("#ddlBasis").select2().val(0, "").trigger("change");
        $("#ddlCurrency").select2().val(0, "").trigger("change");
        $("#ddlServiceType").select2().val(0, "").trigger("change");
        $("#txtAmount").val("");
        this.TID = 0;
        this.HDArrayIndex = '';



    }

    OnclickSelectvalues(DynamicGrid, index) {
        this.HDArrayIndex = index;
        this.TID = this.DynamicGrid[index].TID;
        $("#ddlShipmentType").select2().val(this.DynamicGrid[index].ShipmentTypeID).trigger("change");
        $("#ddlTariffType").select2().val(this.DynamicGrid[index].TariffTypeID).trigger("change");
        $("#ddlChargeCode").select2().val(this.DynamicGrid[index].ChargeCodeID).trigger("change");
        $("#ddlCommodity").select2().val(this.DynamicGrid[index].CommodityID).trigger("change");
        $("#ddlBasis").select2().val(this.DynamicGrid[index].BasisID).trigger("change");
        $("#ddlCurrency").select2().val(this.DynamicGrid[index].CurrencyID).trigger("change");
        $("#ddlServiceType").select2().val(this.DynamicGrid[index].ServiceTypeID).trigger("change");
        $("#txtAmount").val(this.DynamicGrid[index].Amount);


    }



    OnclickRecordSave() {

        var validation = "";
        var ddlPrinciple = $('#ddlPrinciplev').val();
        if (ddlPrinciple == null || ddlPrinciple == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Principle</span></br>"
        }

        var txtEffectiveDate = $('#txtEffectiveDate').val();
        if (txtEffectiveDate == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Effective Date</span></br>"
        }

        var ddlPort = $('#ddlPortv').val();
        if (ddlPort == null || ddlPort == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Port Name</span></br>"
        }


        var ddlTerminal = $('#ddlTerminal').val();
        if (ddlTerminal == null || ddlTerminal == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Terminal</span></br>"
        }
        var ddlEquipmentType = $('#ddlEquipmentType').val();
        if (ddlEquipmentType == null || ddlEquipmentType == "0") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Equipment Type</span></br>"
        }

        if (this.TabControll == 1 || this.TabControll == 2 || this.TabControll == 3 || this.TabControll == 7) {
            var Datav = "";
            for (let item of this.DynamicGrid) {
                Datav += item.ServiceTypeID;
            };
            if (Datav.toString() == "") {
                validation += "<span style='color:red;'>*</span> <span>Please Select Contract Rates</span></br>"
            }
        }
        else if (this.TabControll == 4) {

            var ddlDetenCharges = $('#ddlDetenCharges').val();
            if (ddlDetenCharges == null || ddlDetenCharges == "0") {
                validation += "<span style='color:red;'>*</span> <span>Please Select Export Detention Charges</span></br>"
            }

            var ddlDetenImpCharges = $('#ddlDetenImpCharges').val();
            if (ddlDetenImpCharges == null || ddlDetenImpCharges == "0") {
                validation += "<span style='color:red;'>*</span> <span>Please Select Import Detention Charges</span></br>"
            }

            for (let item of this.DynamicDetentionGrid) {

                if (item.SlabFrom == null || item.SlabFrom == '') {
                    validation += "<span style='color:red;'>*</span> <span>Please Enter Export Detention SlabFrom</span></br>"
                }
                if (item.SlabTo == null || item.SlabTo == '') {
                    validation += "<span style='color:red;'>*</span> <span>Please Enter Export Detention SlabTo</span></br>"
                }

                if (item.CurrencyID == null || item.CurrencyID == 0) {
                    validation += "<span style='color:red;'>*</span> <span>Please Export Detention Currency</span></br>"
                }
                if (item.Amount == null || item.Amount == 0) {
                    validation += "<span style='color:red;'>*</span> <span>Please Enter Export Detention Amount</span></br>"
                }
            };

            for (let item of this.DynamicDetentionGridImp) {

                if (item.SlabFrom == null || item.SlabFrom == '') {
                    validation += "<span style='color:red;'>*</span> <span>Please Enter Import SlabFrom</span></br>"
                }
                if (item.SlabTo == null || item.SlabTo == '') {
                    validation += "<span style='color:red;'>*</span> <span>Please Enter Import SlabTo</span></br>"
                }

                if (item.CurrencyID == null || item.CurrencyID == 0) {
                    validation += "<span style='color:red;'>*</span> <span>Please select Import Currency</span></br>"
                }
                if (item.Amount == null || item.Amount == 0) {
                    validation += "<span style='color:red;'>*</span> <span>Please Enter Import  Amount</span></br>"
                }
            }

            if (validation != "") {
                Swal.fire(validation);
                return false;
            }
        }
        else if (this.TabControll == 5) {
            var Validation = "";
            for (let item of this.DynamicStorageExpLadenGrid) {
                if (item.CurrencyID == 0)
                    Validation += "Please Select Export Laden Currency</br>";
                if (item.SlabFrom == "")
                    Validation += "Please Select Export Laden SlabFrom</br>";
                if (item.SlabTo == "")
                    Validation += "Please Select Export Laden SlabTo</br>";
                if (item.Amount == 0)
                    Validation += "Please Select Export Laden Amount</br>";
            }

            for (let item of this.DynamicStorageExpEmptyGrid) {
                if (item.CurrencyID == 0)
                    Validation += "Please Select Export Empty Currency</br>";
                if (item.SlabFrom == "")
                    Validation += "Please Select Export Empty SlabFrom</br>";
                if (item.SlabTo == "")
                    Validation += "Please Select Export Empty SlabTo</br>";
                if (item.Amount == 0)
                    Validation += "Please Select Export Empty Amount</br>";
            }
            for (let item of this.DynamicStorageImpEmptyGrid) {
                if (item.CurrencyID == 0)
                    Validation += "Please Select Import Empty Currency</br>";
                if (item.SlabFrom == "")
                    Validation += "Please Select Import Empty SlabFrom</br>";
                if (item.SlabTo == "")
                    Validation += "Please Select Import Empty SlabTo</br>";
                if (item.Amount == 0)
                    Validation += "Please Select Import Empty Amount</br>";
            }
            for (let item of this.DynamicStorageImpLadenGrid) {
                if (item.CurrencyID == 0)
                    Validation += "Please Select Import Laden Currency</br>";
                if (item.SlabFrom == "")
                    Validation += "Please Select Import Laden SlabFrom</br>";
                if (item.SlabTo == "")
                    Validation += "Please Select Import Laden SlabTo</br>";
                if (item.Amount == 0)
                    Validation += "Please Select Import Laden Amount</br>";
            }

            if (Validation != "") {
                Swal.fire(Validation);
                return;
            }
        }
        else if (this.TabControll == 6) {
            var Validation = "";
            for (let item of this.DynamicIHCGrid) {
                if (item.CurrencyID == null)
                    Validation += "Please Select Currency</br>";
                if (item.SlabFrom == "")
                    Validation += "Please Select SlabFrom</br>";
                if (item.SlabTo == "")
                    Validation += "Please Select  SlabTo</br>";
                if (item.RevenueAmount == "")
                    Validation += "Please Select Revenue Amount</br>";

                if (Validation != "") {
                    Swal.fire(Validation);
                    return;
                }
            }
        }


        if (validation != "") {
            Swal.fire(validation);
            return false;
        }
        if (this.RegId == 0)
            this.portTariffForm.value.ID = 0;
        else
            this.portTariffForm.value.ID = this.RegId;

        this.portTariffForm.value.PortTariffTypeID = this.TabControll;
        this.portTariffForm.value.PrincibleID = $('#ddlPrinciplev').val();
        this.portTariffForm.value.PortID = $('#ddlPortv').val();
        this.portTariffForm.value.TerminalID = $('#ddlTerminal').val();
        this.portTariffForm.value.EquipmentTypeID = $('#ddlEquipmentType').val();
        if ($('#ddlDetenCharges').val() != null)
            this.portTariffForm.value.ExpChargeID = $('#ddlDetenCharges').val();
        else
            this.portTariffForm.value.ExpChargeID = 0;
        if ($('#ddlDetenImpCharges').val() != null)
            this.portTariffForm.value.ImpChargeID = $('#ddlDetenImpCharges').val();
        else
            this.portTariffForm.value.ImpChargeID = 0;


        this.portTariffForm.value.StartMoveID = 0;
        this.portTariffForm.value.EndMove = 0;
        this.portTariffForm.value.StatusID = 0;
        var Items = [];
        var ItemsSlab = [];
        var ItemsSlabImp = [];
        var ItemsIHC = [];

        var ItemsStorage = [];
        if (this.TabControll == 1 || this.TabControll == 2 || this.TabControll == 3 || this.TabControll == 7) {
            for (let item of this.DynamicGrid) {
                if (item.Amount != null) {
                    Items.push('Insert:' + item.TID, item.ShipmentTypeID, item.TariffTypeID, item.ChargeCodeID,
                        item.CommodityID, item.BasisID, item.CurrencyID, item.ServiceTypeID, item.Amount

                    );
                }
            }
            this.portTariffForm.value.Itemsv = Items.toString();
        }
        else if (this.TabControll == 4) {

            for (let item of this.DynamicDetentionGrid) {
                if (item.Amount != null) {
                    ItemsSlab.push('Insert:' + item.SLID, item.SlabFrom, item.SlabTo, item.CurrencyID,
                        item.Amount
                    );
                }

            }

            this.portTariffForm.value.ItemsSlab = ItemsSlab.toString();

            for (let item of this.DynamicDetentionGridImp) {
                if (item.Amount != null) {
                    ItemsSlabImp.push('Insert:' + item.SLID, item.SlabFrom, item.SlabTo, item.CurrencyID,
                        item.Amount
                    );
                }
            }
            this.portTariffForm.value.ItemsSlabImp = ItemsSlabImp.toString();
        }
        else if (this.TabControll == 6) {
            var CostAmountv = "";
            var LineCostAmtv = "";
            for (let item of this.DynamicIHCGrid) {
                if (item.SlabTo != null) {
                    if (item.CostAmount == null || item.CostAmount == "") {
                        CostAmountv = "0";
                    }
                    else {
                        CostAmountv = item.CostAmount;
                    }

                    if (item.LineAmount == null || item.LineAmount == "") {
                        LineCostAmtv = "0";
                    }
                    else {
                        LineCostAmtv = item.LineAmount;
                    }
                    ItemsIHC.push('Insert:' + item.SLID, item.SlabFrom, item.SlabTo, item.CurrencyID,
                        item.RevenueAmount, CostAmountv, LineCostAmtv
                    );
                }
            }
            this.portTariffForm.value.ItemsIHC = ItemsIHC.toString();

        }


        else if (this.TabControll == 5) {

            for (let item of this.DynamicStorageExpLadenGrid) {

                if (item.Amount != null) {
                    ItemsStorage.push('Insert:' + item.SLID, item.SlabFrom, item.SlabTo, item.CurrencyID,
                        item.Amount, 1, 1
                    );
                }
            }


            for (let item of this.DynamicStorageExpEmptyGrid) {
                if (item.Amount != null) {
                    ItemsStorage.push('Insert:' + item.SLID, item.SlabFrom, item.SlabTo, item.CurrencyID,
                        item.Amount, 2, 1

                    );
                }
            }


            for (let item of this.DynamicStorageImpLadenGrid) {
                if (item.Amount != null) {
                    ItemsStorage.push('Insert:' + item.SLID, item.SlabFrom, item.SlabTo, item.CurrencyID,
                        item.Amount, 1, 2

                    );
                }
            }



            for (let item of this.DynamicStorageImpEmptyGrid) {
                if (item.Amount != null) {
                    ItemsStorage.push('Insert:' + item.SLID, item.SlabFrom, item.SlabTo, item.CurrencyID,
                        item.Amount, 2, 2

                    );
                }
            }

            this.portTariffForm.value.ItemsStorage = ItemsStorage.toString();

        }

        this.service.SaveTariffPortList(this.portTariffForm.value).subscribe((data) => {

            if (data.length > 0) {
                this.portTariffForm.value.ID = data[0].ID;
                this.RegId = data[0].ID;
                if (data[0].AlertMegId == 1) {
                    Swal.fire(data[0].AlertMessage);
                }
                else if (data[0].AlertMegId == 2) {
                    Swal.fire(data[0].AlertMessage);
                }
                this.existingAfterSave();
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    createform() {

        this.portTariffForm = this.fb.group({
            ID: 0,
            RegID: 0,
            PortTariffTypeID: 0,
            PrincibleID: 0,
            EffectiveDate: "",
            PortID: 0,
            TerminalID: 0,
            EquipmentTypeID: 0,
            ExpChargeID: 0,
            ImpChargeID: 0,
            ChargeID: 0,
            StartMoveID: 0,
            EndMove: 0,
            StatusID: 0,
            Remarks: "",
            Itemsv: "",
            ItemsSlab: "",
            ItemsSlabImp: "",
            ItemsIHC: "",
            ItemsDOCharges: "",
            ChargeCodeID: 0,
            ItemsTHCCharges: "",
            ItemsIHCBrackupCharges: '',
            TCID: 0,
            ItemsStorage: "",
            EqTypeID: 0,
            TypeID: 0

        });
    }

    ExistingPortTariffBind() {

        this.service.ExistingTariffPortList(this.portTariffForm.value).subscribe((data) => {
            this.portTariffForm.patchValue(data[0]);
            $('#ddlPrinciplev').select2().val(data[0].PrincibleID);
            $('#ddlPortv').select2().val(data[0].PortID);
            $('#ddlDetenCharges').select2().val(data[0].ExpChargeID);
            $('#ddlDetenImpCharges').select2().val(data[0].ImpChargeID);
            this.OnClickPortTerminal(data[0].PortID);
            $('#ddlTerminal').select2().val(data[0].TerminalID);
            $('#ddlEquipmentType').select2().val(data[0].EquipmentTypeID);
            $('#ddlDetenCharges').select2().val(data[0].ExpChargeID);
            $('#ddlDetenImpCharges').select2().val(data[0].ImpChargeID);

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        this.portTariffForm.value.PortTariffTypeID = this.TabControll;
        this.service.ExistingTariffPortdtlsList(this.portTariffForm.value).subscribe((data) => {
            for (let item of data) {
                this.DynamicGrid.push({
                    'TID': item.TID,
                    'ShipmentType': item.ShipmentType,
                    'ShipmentTypeID': item.ShipmentTypeID,
                    'TariffTypeID': item.TariffTypeID,
                    'TariffType': item.TariffType,
                    'ChargeCode': item.ChargeCode,
                    'ChargeCodeID': item.ChargeCodeID,
                    'Commodity': item.Commodity,
                    'CommodityID': item.CommodityID,
                    'BasisID': item.BasisID,
                    'Basis': item.Basis,
                    'CurrencyID': item.CurrencyID,
                    'Currency': item.Currency,
                    'ServiceType': item.ServiceType,
                    'ServiceTypeID': item.ServiceTypeID,
                    'Amount': item.Amount,
                    'ISSlab': item.ISSlab
                })
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.portTariffForm = this.fb.group({
            ID: 0,
            RegID: 0,
            PortTariffTypeID: 0,
            PrincibleID: 0,
            EffectiveDate: "",
            PortID: 0,
            TerminalID: 0,
            EquipmentTypeID: 0,
            ChargeID: 0,
            ImpChargeID: 0,
            ExpChargeID: 0,
            StartMoveID: 0,
            EndMove: 0,
            StatusID: 0,
            Remarks: "",
            Itemsv: ""

        });
    }


    btnTariffRate(tabID) {
        this.TabControll = tabID;


        if (this.TabControll == 1)
            this.BreakupVisible = false;
        else
            this.BreakupVisible = true;

        if (this.TabControll == 1 || this.TabControll == 2 || this.TabControll == 3 || this.TabControll == 7) {
            this.ExistingTariffValueBind(tabID);
        }
        else if (this.TabControll == 4) {

            this.ExistingTariffSlabValueBind(tabID);
        }
        else if (this.TabControll == 5) {
            this.ExistingTariffStorage(tabID);
        }
        else if (this.TabControll == 6) {

            this.ExistingTariffIHCValueBind(tabID);
        }
        if (this.TabControll == 8) {
            $('#AgreementModal').modal('show');
            this.existinggridBind();
        }
    }

    ExistingTariffValueBind(tabID) {

        this.portTariffForm.value.PortTariffTypeID = this.TabControll;
        this.portTariffForm.value.RegID = this.RegId;
        this.service.ExistingTariffPortdtlsList(this.portTariffForm.value).subscribe((data) => {
            if (data.length > 0) {
                this.DynamicGrid.length = 0;
                for (let item of data) {
                    this.DynamicGrid.push({
                        'TID': item.TID,
                        'ShipmentType': item.ShipmentType,
                        'ShipmentTypeID': item.ShipmentTypeID,
                        'TariffTypeID': item.TariffTypeID,
                        'TariffType': item.TariffType,
                        'ChargeCode': item.ChargeCode,
                        'ChargeCodeID': item.ChargeCodeID,
                        'Commodity': item.Commodity,
                        'CommodityID': item.CommodityID,
                        'BasisID': item.BasisID,
                        'Basis': item.Basis,
                        'CurrencyID': item.CurrencyID,
                        'Currency': item.Currency,
                        'ServiceType': item.ServiceType,
                        'ServiceTypeID': item.ServiceTypeID,
                        'Amount': item.Amount,
                        'ISSlab': item.ISSlab
                    })
                }
            }
            else {

                this.DynamicGrid.length = 0;
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }


    ExistingTariffSlabValueBind(tabID) {

        this.portTariffForm.value.PortTariffTypeID = this.TabControll;
        this.portTariffForm.value.RegID = this.RegId;
        this.portTariffForm.value.ShipmentTypeID = 1;
        this.service.ExistingTariffPortSlabList(this.portTariffForm.value).subscribe((data) => {
            if (data.length > 0) {
                this.DynamicDetentionGrid.length = 0;
                for (let item of data) {
                    this.DynamicDetentionGrid.push({
                        'SLID': item.SLID,
                        'SlabFrom': item.SlabFrom,
                        'SlabTo': item.SlabTo,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount
                    })
                }
            }
            else {
                this.DynamicDetentionGrid.length = 0;
                this.newDynamicSlabExp = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
                this.DynamicDetentionGrid.push(this.newDynamicSlabExp);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.portTariffForm.value.ShipmentTypeID = 2;
        this.service.ExistingTariffPortSlabList(this.portTariffForm.value).subscribe((data) => {

            if (data.length > 0) {
                this.DynamicDetentionGridImp.length = 0;
                for (let item of data) {
                    this.DynamicDetentionGridImp.push({
                        'SLID': item.SLID,
                        'SlabFrom': item.SlabFrom,
                        'SlabTo': item.SlabTo,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount
                    })
                }
            }
            else {
                this.DynamicDetentionGridImp.length = 0;
                this.newDynamicSlabImp = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
                this.DynamicDetentionGridImp.push(this.newDynamicSlabImp);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    ExistingTariffStorage(tabID) {

        this.portTariffForm.value.RegID = this.RegId;
        this.portTariffForm.value.EqTypeID = 1;
        this.portTariffForm.value.TypeID = 1;
        this.portTariffForm.value.PortTariffTypeID = this.TabControll;
        this.service.ExistingTariffPortStor(this.portTariffForm.value).subscribe((data) => {
            if (data.length > 0) {
                this.DynamicStorageExpLadenGrid.length = 0;
                for (let item of data) {
                    this.DynamicStorageExpLadenGrid.push({
                        'SLID': item.SLID,
                        'SlabFrom': item.SlabFrom,
                        'SlabTo': item.SlabTo,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount
                    })
                }
            }
            else {
                this.DynamicStorageExpLadenGrid.length = 0;
                this.newDynamicStorageExpLadenGrid = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
                this.DynamicStorageExpLadenGrid.push(this.newDynamicStorageExpLadenGrid);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.portTariffForm.value.RegID = this.RegId;
        this.portTariffForm.value.EqTypeID = 2;
        this.portTariffForm.value.TypeID = 1;
        this.service.ExistingTariffPortStor(this.portTariffForm.value).subscribe((data) => {
            if (data.length > 0) {
                this.DynamicStorageExpEmptyGrid.length = 0;
                for (let item of data) {
                    this.DynamicStorageExpEmptyGrid.push({
                        'SLID': item.SLID,
                        'SlabFrom': item.SlabFrom,
                        'SlabTo': item.SlabTo,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount
                    })
                }
            }
            else {
                this.DynamicStorageExpEmptyGrid.length = 0;
                this.newDynamicStorageExpEmptyGrid = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
                this.DynamicStorageExpEmptyGrid.push(this.newDynamicStorageExpEmptyGrid);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.portTariffForm.value.RegID = this.RegId;
        this.portTariffForm.value.EqTypeID = 1;
        this.portTariffForm.value.TypeID = 2;
        this.service.ExistingTariffPortStor(this.portTariffForm.value).subscribe((data) => {
            if (data.length > 0) {
                this.DynamicStorageImpLadenGrid.length = 0;
                for (let item of data) {
                    this.DynamicStorageImpLadenGrid.push({
                        'SLID': item.SLID,
                        'SlabFrom': item.SlabFrom,
                        'SlabTo': item.SlabTo,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount
                    })
                }
            }
            else {
                this.DynamicStorageImpLadenGrid.length = 0;
                this.newDynamicStorageImpLadenGrid = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
                this.DynamicStorageImpLadenGrid.push(this.newDynamicStorageImpLadenGrid);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


        this.portTariffForm.value.RegID = this.RegId;
        this.portTariffForm.value.EqTypeID = 2;
        this.portTariffForm.value.TypeID = 2;
        this.service.ExistingTariffPortStor(this.portTariffForm.value).subscribe((data) => {
            if (data.length > 0) {
                this.DynamicStorageImpEmptyGrid.length = 0;
                for (let item of data) {
                    this.DynamicStorageImpEmptyGrid.push({
                        'SLID': item.SLID,
                        'SlabFrom': item.SlabFrom,
                        'SlabTo': item.SlabTo,
                        'CurrencyID': item.CurrencyID,
                        'Amount': item.Amount
                    })
                }
            }
            else {
                this.DynamicStorageImpEmptyGrid.length = 0;
                this.newDynamicStorageImpEmptyGrid = { SLID: 0, SlabFrom: '', SlabTo: '', Currency: '', CurrencyID: '', Amount: '' };
                this.DynamicStorageImpEmptyGrid.push(this.newDynamicStorageImpEmptyGrid);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }




    ExistingTariffIHCValueBind(tabID) {

        this.portTariffForm.value.PortTariffTypeID = this.TabControll;
        this.portTariffForm.value.RegID = this.RegId;
        this.portTariffForm.value.ShipmentTypeID = 1;
        this.service.ExistingTariffPortIHCList(this.portTariffForm.value).subscribe((data) => {
            if (data.length > 0) {

                this.DynamicIHCGrid.length = 0;
                for (let item of data) {
                    this.DynamicIHCGrid.push({
                        'SLID': item.SLID,
                        'SlabFrom': item.SlabFrom,
                        'SlabTo': item.SlabTo,
                        'CurrencyID': item.CurrencyID,
                        'RevenueAmount': item.RevenueAmount,
                        'CostAmount': item.CostAmount,
                        'LineAmount': item.LineAmount
                    })
                }
            }
            else {
                this.DynamicIHCGrid.length = 0;
                this.newDynamicIHC = { SLID: 0, SlabFrom: '', SlabTo: '', CurrencyID: '', RevenueAmount: '', CostAmount: '', LineAmount: '' };
                this.DynamicIHCGrid.push(this.newDynamicIHC);
            }
            console.log(this.DynamicIHCGrid);
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    AddDetentionRow(gRow, index) {
        if (gRow.CurrencyID == "0") {
            Swal.fire("Please Select Currency");
            return;
        }
        var SlbV = parseFloat(gRow.SlabTo) + 1;
        this.newDynamicSlabExp = { SLID: 0, SlabFrom: SlbV, slabTo: '', Currency: '', CurrencyID: 0, Amount: '' };
        this.DynamicDetentionGrid.push(this.newDynamicSlabExp);
    }

    AddDetentionRowImp(gRow, index) {
        if (gRow.CurrencyID == "0") {
            Swal.fire("Please Select Currency");
            return;
        }
        var SlbV = parseFloat(gRow.SlabTo) + 1;
        this.newDynamicSlabImp = { SLID: 0, SlabFrom: SlbV, slabTo: '', Currency: '', CurrencyID: 0, Amount: '' };
        this.DynamicDetentionGridImp.push(this.newDynamicSlabImp);
    }


    AddIHCRow(gRow, index) {
        if (gRow.CurrencyID == "") {
            Swal.fire("Please Select Currency");
            return;
        }
        var SlbV = parseFloat(gRow.SlabTo) + 1;
        this.newDynamicIHC = { SLID: 0, SlabFrom: SlbV, SlabTo: '', CurrencyID: '', RevenueAmount: '', CostAmount: '', LineAmount: '' };
        this.DynamicIHCGrid.push(this.newDynamicIHC);
    }


    SelectTariffBrakup(gRow, index, id) {

        if (this.TabControll == 1) {
            $('#RevenuDOChargesModal').modal('show');
            this.portTariffForm.value.RegID = this.RegId;
            this.service.ExistingTariffPortRevenuDOChargesList(this.portTariffForm.value).subscribe((data) => {
                if (data.length > 0) {
                    this.DynamicRevenuDOChargesGrid.length = 0;
                    for (let item of data) {
                        this.DynamicRevenuDOChargesGrid.push({
                            'SLID': item.SLID,
                            'SlabUpto': item.SlabUpto,
                            'CurrencyID': item.CurrencyID,
                            'Amount': item.Amount
                        })
                    }
                }
                else {
                    this.DynamicRevenuDOChargesGrid.length = 0;
                    this.newDynamicRevenuDOCharges = { SLID: 0, SlabUpto: '', CurrencyID: '', Amount: '' };
                    this.DynamicRevenuDOChargesGrid.push(this.newDynamicRevenuDOCharges);
                }
            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });
        }
        else if (this.TabControll == 3) {

            $('#THCCostChargesModal').modal('show');
            this.portTariffForm.value.RegID = this.RegId;
            this.service.ExistingTariffPortTHCChargesList(this.portTariffForm.value).subscribe((data) => {
                if (data.length > 0) {
                    this.DynamicTHCChargesGrid.length = 0;
                    for (let item of data) {
                        this.DynamicTHCChargesGrid.push({
                            'SLID': item.SLID,
                            'ChargeCodeID': item.ChargeCodeID,
                            'CommodityID': item.CommodityID,
                            'CurrencyID': item.CurrencyID,
                            'ShipmentID': item.ShipmentID,
                            'CntrType': item.CntrType,
                            'Amount': item.Amount,
                            'ExRate': item.ExRate,
                            'LocalAmount': item.LocalAmount
                        })
                    }
                }
                else {
                    this.DynamicTHCChargesGrid.length = 0;
                    this.newDynamicTHCChargesGrid = { SLID: 0, ChargeCodeID: '', CommodityID: 0, CurrencyID: 0, ShipmentID: 0, CntrType: 0, Amount: '', ExRate: '', LocalAmount: '' };
                    this.DynamicTHCChargesGrid.push(this.newDynamicTHCChargesGrid);
                }
            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });
        }


    }

    BtnClickRevenuDOCharges(gRow, index) {
        if (gRow.CurrencyID == "0") {
            Swal.fire("Please Select Currency");
            return;
        }
        this.newDynamicRevenuDOCharges = { SLID: 0, SlabUpto: '', CurrencyID: 0, Amount: '' };
        this.DynamicRevenuDOChargesGrid.push(this.newDynamicRevenuDOCharges);
    }


    OnclickTariffDORecordSave(gRow) {


        var Validation = "";
        for (let i = 0; i < gRow.length; i++) {
            if (gRow[i].CurrencyID == "0")
                Validation += "Please Select Currency</br>";
            if (gRow[i].SlabUpto == "")
                Validation += "Please Select Slab Upto</br>";
            if (gRow[i].Amount == "")
                Validation += "Please Select Amount</br>";

            if (Validation != "") {
                Swal.fire(Validation);
                return;
            }
        }

        var ItemsDOCharges = [];
        for (let item of this.DynamicRevenuDOChargesGrid) {
            ItemsDOCharges.push('Insert:' + item.SLID, item.SlabUpto, item.CurrencyID, item.Amount
            );
        }
        this.portTariffForm.value.ItemsDOCharges = ItemsDOCharges.toString();
        if (this.RegId == 0)
            this.portTariffForm.value.ID = 0;
        else
            this.portTariffForm.value.ID = this.RegId;


        this.service.SaveTariffPortRateDOChargeList(this.portTariffForm.value).subscribe((data) => {

            if (data[0].AlertMegId == 1) {
                Swal.fire(data[0].AlertMessage);
            }
            if (data[0].AlertMegId == 2) {
                Swal.fire(data[0].AlertMessage);
            }
            //Swal.fire("DO Charges updated sucessfully")
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }


    existingAfterSave() {

        if (this.TabControll == 1 || this.TabControll == 2 || this.TabControll == 3 || this.TabControll == 7) {
            this.ExistingTariffValueBind(this.TabControll);
        }
        else if (this.TabControll == 4) {

            this.ExistingTariffSlabValueBind(this.TabControll);
        }
        else if (this.TabControll == 5) {

            this.ExistingTariffStorage(this.TabControll);

        }
        else if (this.TabControll == 6) {

            this.ExistingTariffIHCValueBind(this.TabControll);
        }
    }

    BtnClickTHCCharges(gRow, index) {

        if (gRow.CurrencyID == "") {
            Swal.fire("Please Select Currency");
            return;
        }
        this.newDynamicTHCChargesGrid = { SLID: 0, ChargeCodeID: '', CommodityID: 0, CurrencyID: 0, ShipmentID: 0, CntrType: 0, Amount: '', ExRate: '', LocalAmount: '' };
        this.DynamicTHCChargesGrid.push(this.newDynamicTHCChargesGrid);

    }

    OnclickTariffTHCRecordSave(gRow) {

        var Validation = "";
        for (let i = 0; i < gRow.length; i++) {
            if (gRow[i].CurrencyID == "0")
                Validation += "Please Select Currency</br>";
            if (gRow[i].ChargeCodeID == "")
                Validation += "Please Select Charge Code</br>";
        }
        if (Validation != "") {
            Swal.fire(Validation);
            return;
        }

        var ItemsTHCCharges = [];
        for (let item of this.DynamicTHCChargesGrid) {

            ItemsTHCCharges.push('Insert:' + item.SLID, item.ChargeCodeID, item.ShipmentID, item.CommodityID, item.CntrType, item.CurrencyID,
                item.Amount, item.ExRate, item.LocalAmount
            );
        }
        this.portTariffForm.value.ItemsTHCCharges = ItemsTHCCharges.toString();


        if (this.RegId == 0)
            this.portTariffForm.value.ID = 0;
        else
            this.portTariffForm.value.ID = this.RegId;

        this.service.SaveTariffPortTHCChargeList(this.portTariffForm.value).subscribe((data) => {
            if (data[0].AlertMegId == 1) {
                Swal.fire(data[0].AlertMessage);
            }
            else if (data[0].AlertMegId == 2) {
                Swal.fire(data[0].AlertMessage);
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    btnIFCChargesBrackupRow(gRow, index, id) {

        if (this.TabControll == 6) {
            $('#IFCBrackupChargesModal').modal('show');

            this.portTariffForm.value.RegID = this.RegId;
            this.portTariffForm.value.TCID = id;
            this.service.ExistingTariffPortIHCBrackupChargesList(this.portTariffForm.value).subscribe((data) => {
                if (data.length > 0) {
                    this.DynamicIHCBrackupChargesGrid.length = 0;
                    for (let item of data) {
                        this.DynamicIHCBrackupChargesGrid.push({
                            'SLID': item.SLID,
                            'ChargeCodeID': item.ChargeCodeID,
                            'PaymentTo': item.PaymentTo,
                            'Amount': item.Amount

                        })
                    }
                }
                else {
                    this.DynamicTHCChargesGrid.length = 0;
                    this.newDynamicIHCBrackupChargesGrid = { SLID: 0, ChargeCodeID: 0, PaymentTo: 0, Amount: '' };
                    this.DynamicTHCChargesGrid.push(this.newDynamicIHCBrackupChargesGrid);
                }
            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });

        }

    }
    BtnClickIFCBrackupCharges(gRow, index) {


        if (gRow.CurrencyID == "") {
            Swal.fire("Please Select Currency");
            return;
        }
        this.newDynamicIHCBrackupChargesGrid = { SLID: 0, ChargeCodeID: '', PaymentTo: 0, Amount: '' };
        this.DynamicIHCBrackupChargesGrid.push(this.newDynamicIHCBrackupChargesGrid);

    }

    OnclickTariffBrackupIHCRecordSave(gRow) {


        var Validation = "";
        for (let i = 0; i < gRow.length; i++) {
            if (gRow[i].ChargeCodeID == "")
                Validation += "Please Select Charge Code</br>";

            if (Validation != "") {
                Swal.fire(Validation);
                return;
            }
            var ItemsIHCBrackupCharges = [];
            for (let item of this.DynamicIHCBrackupChargesGrid) {

                ItemsIHCBrackupCharges.push('Insert:' + item.SLID, item.ChargeCodeID, item.PaymentTo, item.Amount
                );
            }
            this.portTariffForm.value.ItemsIHCBrackupCharges = ItemsIHCBrackupCharges.toString();


            if (this.RegId == 0)
                this.portTariffForm.value.ID = 0;
            else
                this.portTariffForm.value.ID = this.RegId;

            this.service.SaveTariffPortIHCBackupChargeList(this.portTariffForm.value).subscribe((data) => {
                if (data[0].AlertMegId == 1) {
                    Swal.fire(data[0].AlertMessage);
                }
                else if (data[0].AlertMegId == 2) {
                    Swal.fire(data[0].AlertMessage);
                }
            }, (error: HttpErrorResponse) => {
                Swal.fire(error.message);
            });
        }

    }

    AddStorageExpLadenRow(gRow, index) {
        var Validation = "";
        if (gRow.CurrencyID == "")
            Validation += "Please Select Currency</br>";
        if (gRow.SlabFrom == "")
            Validation += "Please Select SlabFrom</br>";
        if (gRow.SlabTo == "")
            Validation += "Please Select SlabTo</br>";
        if (gRow.Amount == "")
            Validation += "Please Select Amount</br>";

        if (Validation != "") {
            Swal.fire(Validation);
            return;
        }
        var SlbV = parseFloat(gRow.SlabTo) + 1;
        this.newDynamicStorageExpLadenGrid = { SLID: 0, SlabFrom: SlbV, slabTo: '', Currency: '', CurrencyID: 0, Amount: '' };
        this.DynamicStorageExpLadenGrid.push(this.newDynamicStorageExpLadenGrid);
    }

    AddDynamicStorageExpEmptyGrd(gRow, index) {

        var Validation = "";
        if (gRow.CurrencyID == "")
            Validation += "Please Select Currency</br>";
        if (gRow.SlabFrom == "")
            Validation += "Please Select SlabFrom</br>";
        if (gRow.SlabTo == "")
            Validation += "Please Select SlabTo</br>";
        if (gRow.Amount == "")
            Validation += "Please Select Amount</br>";

        if (Validation != "") {
            Swal.fire(Validation);
            return;
        }
        var SlbV = parseFloat(gRow.SlabTo) + 1;
        this.newDynamicStorageExpEmptyGrid = { SLID: 0, SlabFrom: SlbV, slabTo: '', Currency: '', CurrencyID: 0, Amount: '' };
        this.DynamicStorageExpEmptyGrid.push(this.newDynamicStorageExpEmptyGrid);
    }

    AddStorageImpLadenRow(gRow, index) {
        var Validation = "";
        if (gRow.CurrencyID == "")
            Validation += "Please Select Currency</br>";
        if (gRow.SlabFrom == "")
            Validation += "Please Select SlabFrom</br>";
        if (gRow.SlabTo == "")
            Validation += "Please Select SlabTo</br>";
        if (gRow.Amount == "")
            Validation += "Please Select Amount</br>";

        if (Validation != "") {
            Swal.fire(Validation);
            return;
        }
        var SlbV = parseFloat(gRow.SlabTo) + 1;
        this.newDynamicStorageImpLadenGrid = { SLID: 0, SlabFrom: SlbV, slabTo: '', Currency: '', CurrencyID: 0, Amount: '' };
        this.DynamicStorageImpLadenGrid.push(this.newDynamicStorageImpLadenGrid);
    }

    AddDynamicStorageImpEmptyGrd(gRow, index) {
        var Validation = "";
        if (gRow.CurrencyID == "")
            Validation += "Please Select Currency</br>";
        if (gRow.SlabFrom == "")
            Validation += "Please Select SlabFrom</br>";
        if (gRow.SlabTo == "")
            Validation += "Please Select SlabTo</br>";
        if (gRow.Amount == "")
            Validation += "Please Select Amount</br>";

        if (Validation != "") {
            Swal.fire(Validation);
            return;
        }
        var SlbV = parseFloat(gRow.SlabTo) + 1;
        this.newDynamicStorageImpEmptyGrid = { SLID: 0, SlabFrom: SlbV, slabTo: '', Currency: '', CurrencyID: 0, Amount: '' };
        this.DynamicStorageImpEmptyGrid.push(this.newDynamicStorageImpEmptyGrid);
    }

    OnclickTariffRemove(DynamicGrid, index, Id) {

        this.DynamicGrid.splice(index, 1);
        this.portTariffForm.value.TID = Id;
        this.service.TariffPortchargesDelete(this.portTariffForm.value).subscribe((data) => {

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    OnclickTariffExpDetention(DynamicDetentionGrid, index, id) {

        this.DynamicDetentionGrid.splice(index, 1);
        this.portTariffForm.value.SLID = id;
        this.service.TariffPortchargesDetentionDelete(this.portTariffForm.value).subscribe((data) => {
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    OnclickTariffImpDetention(DynamicDetentionGridImp, index, id) {

        this.DynamicDetentionGridImp.splice(index, 1);
        this.portTariffForm.value.SLID = id;
        this.service.TariffPortchargesDetentionDelete(this.portTariffForm.value).subscribe((data) => {
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    onclickstrageDelete(dynamicGrid, index, id, idtable) {

        dynamicGrid.splice(index, 1);
        this.portTariffForm.value.SLID = id;
        this.service.TariffPortchargesStorageDelete(this.portTariffForm.value).subscribe((data) => {
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    onclickTraiffIHCChargesDelete(dynamicGrid, index, id, idtable) {

        dynamicGrid.splice(index, 1);
        this.portTariffForm.value.SLID = id;
        this.service.TariffPortchargesIHCDelete(this.portTariffForm.value).subscribe((data) => {
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    BtnClickDOChargeDelete(dynamicGrid, index, id) {

        dynamicGrid.splice(index, 1);
        this.portTariffForm.value.SLID = id;
        this.service.TariffPortDOChargesDelete(this.portTariffForm.value).subscribe((data) => {
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    BtnClickTHCChargeDelete(dynamicGrid, index, id) {
        dynamicGrid.splice(index, 1);
        this.portTariffForm.value.SLID = id;
        this.service.TariffPortTHCBrackupChargesDelete(this.portTariffForm.value).subscribe((data) => {
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }




    existinggridBind() {
        this.portTariffForm.value.TariffType = 1;
        this.manage.existingPrincipalTariffAgreementView(this.portTariffForm.value).pipe().subscribe(data => {
            if (data.length > 0) {
                this.FreightCommDynamicGrid.length = 0;
                for (let item of data) {
                    this.FreightCommDynamicGrid.push({
                        'AgreementType': item.AgreementType,
                        'TariffType': item.TariffType,
                        'CommissionType': item.CommissionType,
                        'ShipmentType': item.ShipmentType,
                        'ChargeType': item.ChargeType,
                        'Currency': item.Currency,
                        'CntrType': item.CntrType,
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



    }
}